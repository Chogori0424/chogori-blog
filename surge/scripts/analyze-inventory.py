"""本地 CSV 分析。绝不自动上传，不从 Bundle ID 推断网络域名。"""
import csv
import io
import json
import pathlib
import sys
import unicodedata
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[1]
GROUPS = {
    '购物': '山姆会员商店 永辉线上超市 京东 亚马逊购物 识货 京东快递 京粉 得物 什么值得买 闲鱼 淘宝 拼多多',
    '生活服务': '中国移动 铁路12306 智联招聘 前程无忧51Job 中国联通 高德地图 大众点评 BOSS直聘 华住会 猎聘 麦当劳 美团 懂车帝 抖省省 航旅纵横 滴滴 肯德基 必胜客',
    '社交': 'X Instagram 百度贴吧 豆瓣 虎扑 小黑盒 Reddit 微博 QQ 微信 小红书 知乎 Telegram',
    '视频': 'YouTube 抖音 咪咕视频 虎牙直播 哔哩哔哩 Infuse SenPlayer Moonlight Rex',
    '音乐': 'Discogs 古典乐 网易云音乐 YouTube Music QQ音乐 Spotify',
    '金融': '数字人民币 支付宝 中国银行 中国建设银行 全民生活 中国工商银行 京东金融 旅客八达通 云闪付 汇丰香港',
    '系统应用': 'Keynote讲演 Numbers表格 Pages文稿 TestFlight 库乐队 体育 Apple Store 支持 Developer',
    '政务': '学信网 国家网络身份认证 个人所得税 国家医保服务平台 交管12123',
    '健康': 'Flo',
}
# 静态人工分流启发式，只表示值得观察，不是安装版本实测结论。
POSSIBLE = set('中国移动 铁路12306 智联招聘 山姆会员商店 永辉线上超市 京东 前程无忧51Job 支付宝 高德地图 百度网盘 百度贴吧 中国联通 全民生活 酷安 大众点评 豆瓣 BOSS直聘 华住会 虎扑 识货 京东金融 京粉 猎聘 小黑盒 麦当劳 美团 网易云音乐 夸克网盘 IT之家 微博 得物 什么值得买 懂车帝 抖音 抖省省 闲鱼 淘宝 QQ音乐 QQ QQ邮箱 航旅纵横 云闪付 咪咕视频 滴滴 小红书 拼多多 肯德基 必胜客 虎牙直播 知乎'.split())
PROTECTED = set('115生活 CloudDrive Infuse SenPlayer 哔哩哔哩 Moonlight Rex 数字人民币 支付宝 中国银行 中国建设银行 全民生活 中国工商银行 京东金融 旅客八达通 云闪付 汇丰香港 国家网络身份认证 Authenticator Smart Lock Flo'.split())
PROTECTED.update({'Smart Lock'})
AMBIGUOUS = set('匹歪 Relay Rex'.split())
PRIORITY = set('京东 高德地图 闲鱼 什么值得买 微博 知乎 豆瓣 IT之家 酷安 航旅纵横'.split())
FIELDS = ['App 名称', 'Bundle ID', '当前版本', '分类', '是否可能存在开屏广告', '是否值得处理', '建议方案', '优先级', '证据来源', '当前验证状态', '风险说明', '名称确认状态']


def normalize(s):
    return ' '.join(unicodedata.normalize('NFKC', s).strip().split())


def parse(data):
    encodings = ['utf-8-sig', 'gb18030']
    if data.startswith((b'\xff\xfe', b'\xfe\xff')):
        encodings.insert(0, 'utf-16')
    for encoding in encodings:
        try:
            text = data.decode(encoding)
        except UnicodeDecodeError:
            continue
        rows = list(csv.DictReader(io.StringIO(text)))
        if rows and {'应用名称', 'Bundle ID', '版本'} <= set(rows[0]):
            break
    else:
        raise ValueError('无法识别编码或缺少应用名称/Bundle ID/版本列')
    seen = {}
    conflicts = []
    for r in rows:
        cleaned = {k: normalize(r[k] or '') for k in ['应用名称', 'Bundle ID', '版本']}
        key = cleaned['Bundle ID']
        if not key or not cleaned['应用名称']:
            raise ValueError('名称或 Bundle ID 为空，停止生成以免静默漏项')
        if key in seen and seen[key] != cleaned:
            conflicts.append(key)
        else:
            seen[key] = cleaned
    return list(seen.values()), {'encoding': encoding, 'input_rows': len(rows), 'unique_apps': len(seen), 'duplicates': len(rows)-len(seen), 'conflicting_bundle_ids': sorted(set(conflicts))}


EXPLICIT = {'IT之家','YouTube','YouTube Music','京东','什么值得买','小红书','知乎','虎扑','豆瓣','百度贴吧','酷安','闲鱼','高德地图','Spotify','哔哩哔哩'}

def analyze(rows):
    manifest=json.loads((ROOT/'rules/community.json').read_text())
    maintained={a['app']:json.loads((ROOT/a['file']).read_text()) for a in manifest['apps']}
    catalog=json.loads((ROOT/'rules/source-index.json').read_text())
    index={r['app']:r for r in catalog['apps']}
    result=[]
    for r in rows:
        name,bundle=r['应用名称'],r['Bundle ID']
        special={'iMovie 剪辑':'系统应用','Apple Store':'系统应用','Google Maps':'生活服务','YouTube Music':'音乐'}
        category=special.get(name,next((g for g,names in GROUPS.items() if name in names.split()),'工具'))
        info=maintained.get(name);match=index.get(name)
        chosen=[v for v in info['rules'] if v['enabled']] if info else []
        protected=name in EXPLICIT or name in PROTECTED or bundle.startswith('com.apple.') or category in ['系统应用','金融','政务','健康']
        status='excluded' if protected else 'candidate' if chosen else 'unsupported'
        evidence=catalog['source']['url'] + ('；应用标题行 '+','.join(str(n) for v in match['sections'].values() for n in v) if match else '') if match else 'CSV 身份线索；本轮审查来源未找到可靠适配规则'
        risk='用户确认已有独立方案，明确排除' if name in EXPLICIT else '影音/金融/系统/政务/账号安全主动排除' if protected else '完整社区规则已逐条维护；非广告/业务风险/重复条目不启用；所有效果未实测' if chosen else '已维护上游原始条目，但共享素材/风控或脚本安全与许可风险，未启用' if info else '无可靠规则；不推断请求域名'
        if name in AMBIGUOUS:risk='身份/用途待确认；不推断广告接口'
        result.append(dict(zip(FIELDS,[name,bundle,r['版本'],category,
            '有社区开屏接口线索，未实测' if match and match['startup_evidence'] else '可能（名称分流，非实测）' if name in POSSIBLE else '未知',
            '是（社区广告规则已启用）' if chosen else '仅维护，不启用' if info else '否（本轮）',
            '/'.join(sorted({v['section'] for v in chosen})) if chosen else '不处理（已维护待验证）' if info else '不处理',
            'P1' if chosen else 'P2' if info else 'P3',evidence,status,risk,'待确认' if name in AMBIGUOUS else 'CSV 名称及 Bundle ID，非商店联网认证'])))
    return result


def write_csv(path, fields, rows):
    with path.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator='\n')
        w.writeheader()
        w.writerows(rows)


def main(input_path):
    rows, stats = parse(pathlib.Path(input_path).read_bytes())
    analyzed = analyze(rows)
    out = ROOT/'inventory'
    out.mkdir(exist_ok=True)
    write_csv(out/'apps-analysis.csv', FIELDS, analyzed)
    index=json.loads((ROOT/'rules/source-index.json').read_text())
    installed={r['App 名称'] for r in analyzed}
    manifest=json.loads((ROOT/'rules/community.json').read_text())
    maintained=[json.loads((ROOT/a['file']).read_text()) for a in manifest['apps']]
    stats.update(matched_any_rule=[r['app'] for r in index['apps'] if r['app'] in installed],
        maintained_apps=[a['app'] for a in maintained],
        retained=[a['app'] for a in maintained if any(v['enabled'] for v in a['rules'])],
        pending=[a['app'] for a in maintained if not any(v['enabled'] for v in a['rules'])],
        explicitly_excluded=sorted(EXPLICIT & installed),
        statuses=dict(Counter(r['当前验证状态'] for r in analyzed)),
        unsupported=[r['App 名称'] for r in analyzed if r['当前验证状态']=='unsupported'],
        excluded=[r['App 名称'] for r in analyzed if r['当前验证状态']=='excluded'])
    (out/'analysis-summary.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2)+'\n')
    public=[]
    for a in maintained:
        selected=[v for v in a['rules'] if v['enabled']]
        public.append({'App':a['app'],'状态':'candidate' if selected else 'unsupported','启用规则':len(selected),'维护条目':len(a['rules']),'精确MITM主机':','.join(sorted({h for v in selected for h in v['hostnames']})),'实机测试':'未测试','审查日期':'2026-10-12','来源':a['source']['url'],'风险':'原始前缀/共享主机；业务与效果待实测' if selected else '原始条目存在，因明确风险未启用'})
    for a in manifest['excluded']:
        public.append({'App':a['app'],'状态':'excluded','启用规则':0,'维护条目':0,'精确MITM主机':'','实机测试':'不处理','审查日期':'2026-10-12','来源':index['source']['url'],'风险':a['reason']})
    write_csv(out/'support-matrix.csv',list(public[0]),public)
    print(json.dumps(stats,ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1])
