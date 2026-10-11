import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rules/community.json'), 'utf8'));
export function generate() {
  const {source, rules} = manifest;
  const active = rules.filter(r => r.enabled);
  if (new Set(active.map(r => r.line)).size !== active.length) throw new Error('重复规则');
  if (active.some(r => r.source_review !== 'accepted' || r.hostname.includes('*'))) throw new Error('未审查或过宽 hostname');
  let out = '#!name=Chogori | 开屏精简\n#!desc=社区原生规则精选：QQ音乐、麦当劳、米家；未完成本机效果验证\n#!system=ios\n\n';
  out += '# 派生整理：Chogori0424；上游 fmz200 / 奶思；GPL-3.0，见 licenses/ 与 NOTICE.md\n';
  out += `# 来源 ${source.url}\n# 文件最近维护 ${source.file_updated}；核实 ${source.review_date}；不自动同步\n`;
  for (const section of ['URL Rewrite', 'Map Local']) {
    out += `\n[${section}]\n`;
    for (const rule of active.filter(r => r.section === section)) {
      out += `# ${rule.app} / 开屏 / ${rule.status} / source L${rule.source_line} / 实机未测试\n${rule.line}\n`;
    }
  }
  out += `\n[MITM]\nhostname = %APPEND% ${[...new Set(active.map(r => r.hostname))].join(', ')}\n`;
  return out;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = path.join(root, 'StartupAds-Lite.sgmodule');
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(target, 'utf8') !== generate()) throw new Error('生成文件与源码不一致');
  } else fs.writeFileSync(target, generate());
}
