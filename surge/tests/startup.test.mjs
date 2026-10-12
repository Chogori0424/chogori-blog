import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {manifest,apps,rules,active,hostnames,generate} from '../scripts/generate.mjs';
const root=new URL('../',import.meta.url);
const fixtures=JSON.parse(fs.readFileSync(new URL('http-fixtures.json',import.meta.url),'utf8'));
const http=active.filter(r=>r.section!=='Rule');
const pattern=r=>r.line.split(' ')[0];
const regex=r=>new RegExp(pattern(r));
const negative=[
'https://pan.baidu.com/api/certuser/get','https://pan.baidu.com/pmall/order/privilege/info',
'https://pan.baidu.com/rest/2.0/pcs/file','https://home.mi.com/cgi-op/api/v1/resource/realtime/deviceList',
'https://music.y.qq.com/song/stream','https://y.gtimg.cn/music/common/upload/album/image.jpg',
'https://m.client.10010.com/mobileService/customer/accountListData','https://m.client.10010.com/mobileService/customer/getclientconfig.htm',
'https://client.app.coc.10086.cn/biz-orange/DN/init/startInit','https://myusmile.online/user/version/requestFirmwareUpdate/',
'https://api-sams.walmartmobile.cn/api/v1/sams/trade/order/getOftenBuyGoods',
'https://api.bilibili.com/x/v2/splash/list','https://cdnfhnfile.115cdn.net/video.mp4',
'https://acs.m.goofish.com/gw/mtop.taobao.idlecommerce.splash.ads','https://api.zhihu.com/commercial_api/launch_v2',
'https://edith.xiaohongshu.com/api/sns/v1/system_service/splash_config','https://app-api.smzdm.com/util/loading',
'https://napi.ithome.com/api/news/index','https://api.douban.com/v2/app_ads/',
'https://api.m.jd.com/client.action?functionId=start','https://tiebac.baidu.com/c/s/ad',
'https://api.mcd.cn/login','https://api.mcd.cn/bff/portal/home/menu',
'https://res.kfc.com.cn/order/pay','https://api.pinduoduo.com/api/order/detail',
'https://api.pinduoduo.com/api/cappuccino/menu',
'https://img01.51jobcdn.com/im/mkt/tg/2026banner/jcgz2/salary.jpg',
'https://hweb-manager.huazhu.com/bundle/upgrade/check','https://mapi.dianping.com/mapi/intelliindex'
];
test('全量匹配清单与独立/敏感排除，生成一致性',()=>{
 assert.equal(apps.length,27);assert.equal(new Set(active.map(r=>r.app)).size,23);assert.equal(active.length,98);assert.equal(hostnames.length,43);
 const excluded=new Set([...manifest.excluded.map(a=>a.app),...manifest.additional_exclusions]);
 assert.equal(manifest.excluded.length+apps.length,45);
 assert.ok(active.every(r=>!excluded.has(r.app) && r.status==='candidate'));
 assert.ok(!hostnames.some(h=>h.includes('*')));
 assert.equal(new Set(active.map(r=>r.line)).size,active.length);
 const output=generate();assert.equal(output,fs.readFileSync(new URL('StartupAds-Lite.sgmodule',root),'utf8'));
 for(const bad of ['[Script]','[General]','[Proxy','[DNS]','PROCESS-NAME','IP-CIDR','DOMAIN-KEYWORD','reject-200','reject-dict','myBlockAds','FINAL,'])assert.ok(!output.includes(bad));
});
test('每条 HTTP 正例、精确主机、同主机业务反例、伪造域名反例',()=>{
 assert.equal(Object.keys(fixtures).length,http.length);
 for(const r of http){
  const url=fixtures[r.source_line];assert.ok(url,`${r.app} ${r.source_line}`);assert.ok(regex(r).test(url),url);
  assert.ok(hostnames.includes(new URL(url).hostname));
  assert.ok(r.hostnames.includes(new URL(url).hostname));
  const fake=new URL(url);fake.hostname+='.'+'example.org';assert.ok(!regex(r).test(fake.href),fake.href);
  const other=new URL(url);other.pathname='/account/login';other.search='';assert.ok(!regex(r).test(other.href));
  for(const n of negative)assert.ok(!regex(r).test(n),`L${r.source_line} 非广告命中 ${n}`);
 }
});
test('HTTP 命中重叠只有同动作的百度 pcs/ad 前缀',()=>{
 const overlaps=[];
 for(const [line,url] of Object.entries(fixtures)){
  const hits=http.filter(r=>regex(r).test(url));
  if(hits.length>1){overlaps.push(hits.map(r=>r.source_line).sort((a,b)=>a-b).join(','));assert.ok(hits.every(r=>r.section==='URL Rewrite' && r.line.endsWith(' - reject')));}
 }
 assert.deepEqual([...new Set(overlaps)],['4092,4093']);
});
test('Map Local 上游 200 payload/媒体类型模拟与非目标保持',()=>{
 for(const r of active.filter(r=>r.section==='Map Local')){
  const fields=Object.fromEntries([...r.line.matchAll(/([\w-]+)=("[^"]*"|\S+)/g)].map(m=>[m[1],m[2].replace(/^"|"$/g,'')]));
  assert.equal(fields['status-code'],'200');assert.ok(['text','tiny-gif'].includes(fields['data-type']));
  if(fields['data-type']==='text'){
   assert.ok(['{}',' '].includes(fields.data));
   if(fields.data==='{}'){assert.deepEqual(JSON.parse(fields.data),{});assert.equal(fields.header,'Content-Type:application/json');}
  }else assert.ok(!fields.data);
 }

});
test('Domain 规则仅广告/统计；共享 CDN/DNS/风控与既有方案不命中',()=>{
 const dns=active.filter(r=>r.section==='Rule');
 const match=(line,hostname)=>{const [type,domain]=line.split(',');return type==='DOMAIN'?hostname===domain:hostname===domain||hostname.endsWith('.'+domain);};
 for(const r of dns){const [type,domain,action]=r.line.split(',');assert.ok(['DOMAIN','DOMAIN-SUFFIX'].includes(type));assert.equal(action,'REJECT');assert.ok(match(r.line,domain));assert.ok(!match(r.line,domain+'.example.org'));assert.ok(!hostnames.includes(domain),'DNS Reject 与 MITM 条目不能互相遮蔽');}
 for(const h of ['pan.baidu.com','cdnfhnfile.115cdn.net','grpc.biliapi.net','api.bilibili.com','api.m.jd.com','napi.ithome.com','api.zhihu.com','tiebac.baidu.com','httpdns.music.163.com','bds.snssdk.com','p3.pstatp.com','p3-pack.byteimg.com','fc-video.cdn.bcebos.com','acs.m.goofish.com'])assert.ok(!dns.some(r=>match(r.line,h)),h);
});
test('固定来源/许可及四个明确风险 App 只维护不启用',()=>{
 assert.match(manifest.source.ref,/^[0-9a-f]{40}$/);assert.match(manifest.source.sha256,/^[0-9a-f]{64}$/);
 assert.equal(manifest.source.license,'GPL-3.0');assert.ok(fs.readFileSync(new URL('licenses/fmz200-GPL-3.0.txt',root),'utf8').includes('GNU GENERAL PUBLIC LICENSE'));
 for(const app of ['懂车帝','抖音','铁路12306','Reddit']){const a=apps.find(a=>a.app===app);assert.ok(a.rules.length);assert.ok(!a.rules.some(r=>r.enabled));assert.ok(a.rules.every(r=>r.reason));}
});
if(process.env.SURGE_SOURCE_SNAPSHOT)test('所有按 App 维护的原始行及源快照校验',()=>{
 const bytes=fs.readFileSync(process.env.SURGE_SOURCE_SNAPSHOT);assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.source.sha256);
 const lines=bytes.toString('utf8').split(/\r?\n/);for(const r of rules)assert.equal(r.line,lines[r.source_line-1]);
});
