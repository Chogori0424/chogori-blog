# 应用匹配与维护报告

2026-10-12 按用户新授权扩大到完整社区广告范围，同时排除截图中已安装独立模块。CSV 实际解析为 UTF-8 BOM，125 行、125 个唯一 App，无重复/版本冲突。完整名称、Bundle ID、版本、分类、处理建议、风险仅保存在本地 inventory/apps-analysis.csv。

45 个公开来源匹配项 = 18 个排除 + 27 个按 App 完整维护。27 个维护项共有 257 条来源条目，其中 23 个 App 启用 98 条，4 个因明确风险暂不启用。全部 98 条原始规则行逐字保留；其中 43 条 Domain/Domain-Suffix、27 条 URL Rewrite、28 条 Map Local，0 条 HTTP 脚本。43 个精确 MITM hostname。

本地 125 项状态：{'unsupported': 52, 'candidate': 23, 'excluded': 50}。没有找到可采用规则的项与无广告需求工具项都可能是 unsupported；不宣称这些 App 都有广告或穷尽互联网规则。全部 candidate 都没有当前 iPhone 去广告成功证明。原先基于名称的“50 个可能开屏”不再作为覆盖率。

## 本轮维护项

| App | 已维护原始条目 | 启用规则 | 精确 MITM 主机 | 状态 |
| --- | --- | --- | --- | --- |
| 懂车帝 | 2 | 0 | 无 | 仅维护、暂不启用 |
| 抖音 | 2 | 0 | 无 | 仅维护、暂不启用 |
| 虎牙直播 | 11 | 3 | business.msstatic.com, cdnfile1.msstatic.com, live-ads.huya.com | candidate，实机未测试 |
| 美团 | 10 | 6 | 无 | candidate，实机未测试 |
| 咪咕视频 | 16 | 11 | common-sc.miguvideo.com, ggc.miguvideo.com, public-deliver9.miguvideo.com | candidate，实机未测试 |
| 米家 | 3 | 3 | home.mi.com | candidate，实机未测试 |
| 网易云音乐 | 32 | 3 | 无 | candidate，实机未测试 |
| QQ音乐 | 39 | 15 | music.y.qq.com, us.l.qq.com, y.gtimg.cn | candidate，实机未测试 |
| 淘宝 | 43 | 19 | acs.m.taobao.com | candidate，实机未测试 |
| 中国联通 | 7 | 2 | m.client.10010.com, m1.ad.10010.com | candidate，实机未测试 |
| 中国移动 | 4 | 1 | client.app.coc.10086.cn | candidate，实机未测试 |
| 百度网盘 | 17 | 9 | issuecdn.baidupcs.com, ndstatic.cdn.bcebos.com, pan.baidu.com, staticsns.cdn.bcebos.com, update.pan.baidu.com | candidate，实机未测试 |
| 必胜客 | 2 | 2 | res.pizzahut.com.cn | candidate，实机未测试 |
| 大众点评 | 20 | 4 | img.meituan.net, mapi.dianping.com, rms.meituan.com, www.dpfile.com | candidate，实机未测试 |
| 得物 | 2 | 1 | app.dewu.com | candidate，实机未测试 |
| 航旅纵横 | 3 | 1 | oss.umetrip.com | candidate，实机未测试 |
| 华住会 | 6 | 3 | hweb-hotel.huazhu.com, hweb-manager.huazhu.com | candidate，实机未测试 |
| 肯德基 | 3 | 2 | res.kfc.com.cn | candidate，实机未测试 |
| 拼多多 | 3 | 1 | api.pinduoduo.com, api.yangkeduo.com | candidate，实机未测试 |
| 前程无忧51Job | 12 | 4 | appapi.51job.com, appapi.51jobapp.com, cupid.51job.com, cupid.51jobapp.com, img01.51jobcdn.com | candidate，实机未测试 |
| 山姆会员商店 | 7 | 2 | api-sams.walmartmobile.cn | candidate，实机未测试 |
| 识货 | 3 | 1 | sh-gateway.shihuo.cn | candidate，实机未测试 |
| 笑容加 | 5 | 2 | wemallh5.usmile.com, www.myusmile.online | candidate，实机未测试 |
| 猎聘 | 2 | 2 | api-ac.liepin.com, api-wanda.liepin.com | candidate，实机未测试 |
| 麦当劳 | 1 | 1 | api.mcd.cn | candidate，实机未测试 |
| 铁路12306 | 1 | 0 | 无 | 仅维护、暂不启用 |
| Reddit | 1 | 0 | 无 | 仅维护、暂不启用 |

## 匹配但排除

| App | 原因 |
| --- | --- |
| 百度贴吧 | 截图确认已安装独立模块 |
| 哔哩哔哩 | 既有独立方案，继续排除 |
| 豆瓣 | 截图确认已安装独立模块 |
| 高德地图 | 截图确认已安装独立模块 |
| 虎扑 | 截图确认已安装独立模块 |
| 京东 | 截图确认已安装独立模块 |
| 闲鱼 | 截图确认已安装独立模块 |
| 小红书 | 截图确认已安装独立模块 |
| 知乎 | 截图确认已安装独立模块 |
| 什么值得买 | 截图确认已安装独立模块 |
| 云闪付 | 金融/支付/政务账号安全保护 |
| 国家医保服务平台 | 金融/支付/政务账号安全保护 |
| 京东金融 | 金融/支付/政务账号安全保护 |
| Spotify | 既有独立方案，继续排除 |
| 全民生活 | 金融/支付/政务账号安全保护 |
| YouTube | 截图确认已安装独立模块 |
| IT之家 | 截图确认已安装独立模块 |
| 酷安 | 截图确认已安装独立模块 |

YouTube Music 也明确排除，但本轮 45 项标题索引没有单独匹配它。其他金融、政务、系统、敏感账号及影音核心也继续排除。

未匹配来源的潜在广告目标包括智联招聘、永辉线上超市、BOSS直聘、小黑盒、滴滴等，暂不猜测网络接口。源标题匹配索引和 fixed SHA256 见 rules/source-index.json；完整逐条原因见 rules/apps/*.json。所有匹配项均已维护归属，没有将已有独立方案重新并入。
