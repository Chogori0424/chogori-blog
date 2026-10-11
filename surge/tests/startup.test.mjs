import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {manifest,generate} from '../scripts/generate.mjs';
const root = new URL('../',import.meta.url);
const excluded = ['YouTube','YouTube Music','虎扑','酷安','Spotify','哔哩哔哩'];
test('只有三条已人工审查的原生规则，无脚本/业务分流',()=>{
 assert.equal(manifest.rules.length,3);
 assert.equal(new Set(manifest.rules.map(r=>r.hostname)).size,3);
 assert.ok(manifest.rules.every(r=>!excluded.includes(r.app) && r.status==='candidate' && r.source_review==='accepted'));
 const output=generate();
 for(const forbidden of ['[Script]','[Rule]','[General]','[Proxy','[DNS]','PROCESS-NAME','reject-200','reject-dict'])assert.ok(!output.includes(forbidden));
 assert.equal(output,fs.readFileSync(new URL('StartupAds-Lite.sgmodule',root),'utf8'));
 assert.ok(!manifest.rules.some(r=>r.hostname.includes('*')));
});
test('目标路径正例、业务/登录/播放/其他域名反例及交叉重复',()=>{
 const negatives=['https://api.mcd.cn/bff/portal/home/menu','https://api.mcd.cn/login','https://home.mi.com/cgi-op/api/v1/resource/realtime/deviceList','https://home.mi.com/login','https://y.gtimg.cn/music/common/upload/album/image.jpg','https://music.y.qq.com/stream','https://api.bilibili.com/x/v2/splash/list','https://cdnfhnfile.115cdn.net/video.mp4','https://api.mcd.cn.example.org/bff/portal/home/splash','https://example.com/cgi-op/api/v1/resource/realtime/openingBanner'];
 for(const rule of manifest.rules){
  const regex = new RegExp(rule.line.split(' ')[0]);
  assert.ok(regex.test(rule.positive));assert.ok(!regex.test(rule.negative));
  for(const url of negatives)assert.ok(!regex.test(url),url);
  for(const other of manifest.rules.filter(r=>r!==rule))assert.ok(!regex.test(other.positive));
  // 原始前缀语义明确保留，不声称不存在扩展路径误匹配。
  if(rule.section==='Map Local')assert.ok(regex.test(rule.positive.split('?')[0]+'Suffix'));
 }
});
test('Map Local 脱敏模拟响应保留上游状态、内容及 Content-Type',()=>{
 for(const r of manifest.rules.filter(r=>r.section==='Map Local')){
  const fields=Object.fromEntries([...r.line.matchAll(/([\w-]+)=("[^"]*"|\S+)/g)].map(m=>[m[1],m[2].replace(/^"|"$/g,'')]));
  assert.equal(fields['status-code'],'200');assert.equal(fields['data-type'],'text');
  if(r.app==='米家'){assert.deepEqual(JSON.parse(fields.data),{});assert.equal(fields.header,'Content-Type:application/json');}
  else {assert.equal(fields.data,' ');assert.ok(!fields.header);}
 }
});
test('来源固定、GPL 许可及唯一源码行',()=>{
 assert.match(manifest.source.ref,/^[0-9a-f]{40}$/);assert.match(manifest.source.sha256,/^[0-9a-f]{64}$/);
 assert.equal(manifest.source.license,'GPL-3.0');assert.equal(new Set(manifest.rules.map(r=>r.source_line)).size,3);
 assert.ok(fs.readFileSync(new URL('licenses/fmz200-GPL-3.0.txt',root),'utf8').includes('GNU GENERAL PUBLIC LICENSE'));
});
// 可选：以人工下载的固定上游快照核验逐字相等。此测试不下载或执行远端代码。
if(process.env.SURGE_SOURCE_SNAPSHOT)test('固定上游快照校验和及逐字一致',()=>{
 const bytes=fs.readFileSync(process.env.SURGE_SOURCE_SNAPSHOT);
 return import('node:crypto').then(({createHash})=>{
  assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.source.sha256);
  const lines=bytes.toString('utf8').split(/\r?\n/);
  for(const r of manifest.rules)assert.equal(r.line,lines[r.source_line-1]);
 });
});
