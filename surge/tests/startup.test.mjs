import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import {generate} from '../scripts/generate.mjs';
const source = fs.readFileSync(new URL('../scripts/startup-lite.js', import.meta.url), 'utf8');
const rule = JSON.parse(fs.readFileSync(new URL('../rules/jd.json', import.meta.url)));
const url = 'https://api.m.jd.com/client.action?functionId=start';
const fixture = {code:0,images:[[{showTimes:2,time:5,onlineTime:'original',other:7},{showTimes:0,time:9}]],showTimesDaily:3,countdown:6,business:{keep:true}};
function run(u=url, body=JSON.stringify(fixture), options={}) {
  const results=[];
  const context={$request:{url:u,method:options.method||'GET'},$done:r=>results.push(r)};
  if (!options.requestOnly) context.$response={status:options.status??200,body};
  vm.runInNewContext(source, context, {timeout:100});
  assert.equal(results.length,1,'必须只调用一次 $done');
  return JSON.parse(JSON.stringify(results[0]));
}
test('精确 URL 正反例和主机/路径/参数边界', () => {
  const regex = new RegExp(rule.pattern);
  for (const u of [url,url+'&x=1','https://api.m.jd.com/client.action?x=1&functionId=start']) assert.equal(regex.test(u),true,u);
  for (const u of ['http://api.m.jd.com/client.action?functionId=start',url+'Other',url+'#frag',url.replace('jd.com','jd.com.evil'),url.replace('client.action','clientXaction'),url.replace('start','login'),url.replace('start','%73tart'),'https://media.example/video.m3u8','https://app.bilibili.com/x/v2/splash/list','https://115.com/start','https://iyes.youku.com/uts/v1/start/']) {
    assert.equal(regex.test(u),false,u);assert.deepEqual(run(u),{},u);
  }
});
test('只改广告计次和时长，保留业务、日期、countdown、零计次项', () => {
  const obj=JSON.parse(run().body);
  const expected=structuredClone(fixture);expected.images[0][0].showTimes=0;expected.images[0][0].time=0;expected.showTimesDaily=0;
  assert.deepEqual(obj,expected);
  assert.deepEqual(run(url+'&functionId=login'),{});
  assert.deepEqual(run(url+'&functionId=start'),{});
});
test('未知结构、坏 JSON、错误响应、错误方法、请求阶段均放行', () => {
  for (const body of ['{','null','[]','{}','<html>error</html>',undefined,JSON.stringify({...fixture,code:401}),JSON.stringify({...fixture,images:[[{showTimes:2},null]]}),JSON.stringify({...fixture,images:[{showTimes:2}]}),JSON.stringify({...fixture,images:[[{showTimes:'2'}]]})]) assert.deepEqual(run(url,body===undefined?null:body),{});
  for (const status of [204,302,403,500]) assert.deepEqual(run(url,JSON.stringify(fixture),{status}),{});
  assert.deepEqual(run(url,JSON.stringify(fixture),{method:'DELETE'}),{});
  assert.deepEqual(run(url,JSON.stringify(fixture),{requestOnly:true}),{});
  const results=[];vm.runInNewContext(source,{$done:r=>results.push(r)});assert.equal(results.length,1);assert.equal(Object.keys(results[0]).length,0);
});
test('模块生成一致、独立测试地址、没有宽 MITM 或重复脚本', () => {
  const previewURL=new URL('../StartupAds-Lite.candidate.sgmodule',import.meta.url);
  if (!fs.existsSync(previewURL)) return; // 源码阶段还未生成，第二阶段必须生成后复测。
  const preview=fs.readFileSync(previewURL,'utf8');
  const ref=preview.match(/chogori-blog\/([0-9a-f]{40})\/surge\/scripts/)[1];
  assert.equal(preview,generate(ref,true));
  assert.equal(fs.readFileSync(new URL('../StartupAds-Lite.sgmodule',import.meta.url),'utf8'),generate(ref));
  assert.equal(preview.split('\n').filter(l=>l.startsWith('京东_开屏 =')).length,1);
  assert.ok(preview.includes('hostname = %APPEND% api.m.jd.com'));
  assert.ok(!preview.includes('/main/surge/scripts'));
  assert.ok(!preview.includes('reject'));
  assert.equal(rule.enabled,false);
  assert.equal(rule.status,'candidate');
});
