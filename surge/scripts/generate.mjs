import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rules/community.json'), 'utf8'));
export const apps = manifest.apps.map(a => JSON.parse(fs.readFileSync(path.join(root,a.file),'utf8')));
export const rules = apps.flatMap(a => a.rules.map(r => ({...r,app:a.app,source:a.source})));
export const active = rules.filter(r=>r.enabled);
export const hostnames = [...new Set(active.flatMap(r=>r.hostnames))].sort();
export function generate() {
  const excluded = new Set([...manifest.excluded.map(a=>a.app),...manifest.additional_exclusions]);
  if (active.some(r=>excluded.has(r.app))) throw new Error('已有独立方案或受保护 App 不能生成');
  if (hostnames.some(h=>h.includes('*'))) throw new Error('禁止通配 MITM');
  if (new Set(active.map(r=>r.line)).size!==active.length) throw new Error('重复启用规则');
  if(active.some(r=>!['Rule','URL Rewrite','Map Local'].includes(r.section)))throw new Error('未审查的执行类型');
  let out = '#!name=Chogori | 社区广告精简\n#!desc=按实际应用筛选完整社区广告规则；排除既有独立方案及敏感业务；未完成本机效果验证\n#!system=ios\n\n';
  out += '# 稳定入口名称保留；范围已由仅开屏调整为各 App 广告/推广。\n';
  out += '# 派生整理：Chogori0424；上游 fmz200 / 奶思；GPL-3.0，见 licenses/ 与 NOTICE.md\n';
  out += `# 来源 ${manifest.source.url}\n# 文件最近维护 ${manifest.source.file_updated}；核实 ${manifest.source.review_date}；不自动同步\n`;
  out += `# ${apps.length} 个 App 维护源；${new Set(active.map(r=>r.app)).size} 个 App 启用 ${active.length} 条；${hostnames.length} 个精确 MITM hostname；0 个 HTTP 脚本\n`;
  for(const section of ['Rule','URL Rewrite','Map Local']){
    out+=`\n[${section}]\n`;
    for(const app of apps){
      const selected=active.filter(r=>r.app===app.app && r.section===section);
      if(!selected.length)continue;
      out+=`# ${app.app} / candidate / 核实 ${manifest.source.review_date} / 实机未测试\n`;
      for(const rule of selected)out+=`# source L${rule.source_line}\n${rule.line}\n`;
    }
  }
  out+=`\n[MITM]\nhostname = %APPEND% ${hostnames.join(', ')}\n`;
  return out;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const target=path.join(root,'StartupAds-Lite.sgmodule');
 if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==generate())throw new Error('生成文件与源码不一致');}
 else fs.writeFileSync(target,generate());
}
