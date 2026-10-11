import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function generate(ref, candidate = false) {
  if (!/^[0-9a-f]{40}$/.test(ref)) throw new Error('必须固定到已推送的 40 位脚本提交');
  const r = JSON.parse(fs.readFileSync(path.join(root, 'rules/jd.json'), 'utf8'));
  const header = `#!name=Chogori | 开屏精简${candidate ? '候选测试' : ''}\n#!desc=${candidate ? '京东候选，仅供逐项实测，未验证效果' : '安全入口：候选未启用；实机验证后人工发布'}\n#!system=ios\n\n# 生成源：rules/jd.json；审查日期 2026-10-11；无真实 App 验证。\n`;
  if (!candidate && !r.enabled) return header + '# 当前启用 0 条规则、0 个 MITM hostname。候选测试入口见 README.md。\n';
  if (r.enabled && r.status !== 'verified') throw new Error('未经实机验证不得发布正式规则');
  return header + `# ${r.app} / 开屏 / ${r.status} / ${r.source}\n[Script]\n京东_开屏 = type=http-response,pattern=${r.pattern},requires-body=true,max-size=262144,timeout=5,script-path=https://raw.githubusercontent.com/Chogori0424/chogori-blog/${ref}/surge/scripts/startup-lite.js\n\n[MITM]\nhostname = %APPEND% ${r.hostname}\n`;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ref = process.argv[2];
  fs.writeFileSync(path.join(root, 'StartupAds-Lite.sgmodule'), generate(ref));
  fs.writeFileSync(path.join(root, 'StartupAds-Lite.candidate.sgmodule'), generate(ref, true));
}
