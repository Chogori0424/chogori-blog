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


def analyze(rows):
    research = {r['app']: r for r in json.loads((ROOT/'rules/research.json').read_text())}
    jd = json.loads((ROOT/'rules/jd.json').read_text())
    research['京东'] = jd
    evidence_path = ROOT/'inventory/review-evidence.json'
    local_evidence = json.loads(evidence_path.read_text()) if evidence_path.exists() else {}
    result = []
    for r in rows:
        name, bundle = r['应用名称'], r['Bundle ID']
        # 显示名称含空格的产品不依赖 split 映射。
        special = {'iMovie 剪辑': '系统应用', 'Apple Store': '系统应用', 'Google Maps': '生活服务', 'YouTube Music': '音乐'}
        category = special.get(name, next((g for g, names in GROUPS.items() if name in names.split()), '工具'))
        info = research.get(name)
        possible = name in POSSIBLE
        protected = name in PROTECTED or bundle.startswith('com.apple.') or category in ['系统应用','金融','政务','健康']
        worth = possible and not protected and name not in AMBIGUOUS
        status = 'excluded' if protected or not worth else (info['status'] if info else 'unsupported')
        risk = ('影音、账号、金融、政务或健康服务主动排除' if protected else
                '本轮未找到通过独立开屏安全审查的规则；不代表 App 无广告或互联网无规则')
        if info and not protected:
            risk = info.get('risk', info.get('decision', risk))
        if name in AMBIGUOUS:
            risk = '仅有名称和 Bundle ID，产品身份或用途待确认；不推断广告域名'
        result.append(dict(zip(FIELDS, [name,bundle,r['版本'],category,
            '可能（静态分流，非实测）' if possible else '未知/未列为优先目标',
            '是（先实测）' if worth else '否',
            'Script（默认禁用候选）' if name=='京东' else '不处理（先研究/实测）' if worth else '不处理',
            'P1' if worth and name in PRIORITY else 'P2' if worth else 'P3',
            info['source'] if info else local_evidence[name]['source'] + '；品牌线索不等同于开屏适配' if name in local_evidence else '本地 CSV 名称与 Bundle ID；人工分流启发式，无接口证据',
            status,risk,'待确认' if name in AMBIGUOUS else '按 CSV 名称和 Bundle ID 识别，非商店联网认证'])))
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
    stats.update(possible_splash=sum(r['App 名称'] in POSSIBLE for r in analyzed), worth_testing=sum(r['是否值得处理'].startswith('是') for r in analyzed), statuses=dict(Counter(r['当前验证状态'] for r in analyzed)), categories=dict(Counter(r['分类'] for r in analyzed)), ambiguous_names=[r['App 名称'] for r in analyzed if r['名称确认状态']=='待确认'])
    (out/'analysis-summary.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2)+'\n')
    # 公共支持矩阵由已审查规则源独立生成，不能导出整个安装清单。
    public=[]
    for r in [json.loads((ROOT/'rules/jd.json').read_text())]+json.loads((ROOT/'rules/research.json').read_text()):
        public.append({'App':r['app'],'状态':r['status'],'正式启用':'否','候选实现':'Script' if r['app']=='京东' else '无','实机测试':'未测试','审查日期':r['review_date'],'来源':r['source'],'风险':r.get('risk',r.get('decision'))})
    write_csv(out/'support-matrix.csv', list(public[0]), public)
    print(json.dumps(stats,ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1])
