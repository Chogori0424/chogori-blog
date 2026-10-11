# 应用匹配报告

核实日期 2026-10-11。实际解析 CSV 内容：UTF-8 BOM，125 行、125 个唯一 Bundle ID，无重复、无版本冲突。完整 App 名称、Bundle ID、版本、分类、建议及风险仅保存在本地 `inventory/apps-analysis.csv`，不提交原始清单。

## 对照结果与统计口径

- **45 个 App** 在固定 fmz200 综合模块中找到对应应用标题的广告规则。这里只表示广告来源匹配，不表示开屏适配或规则有效。
- **12 个 App** 有明确 `splash` / `openingBanner` / `get_launch` / `launch_v2` 接口线索，包括主动排除的哔哩哔哩；非排除项为 **11 个**：高德地图、米家、闲鱼、小红书、知乎、QQ音乐、淘宝、大众点评、拼多多、前程无忧51Job、麦当劳。
- **3 个 App / 3 条原生规则** 通过本轮范围和来源审查进入统一模块：QQ音乐、麦当劳、米家。均为 candidate，本机未测试。
- **9 个 App** 有独立模块研究选项，仅列清单不安装：闲鱼、小红书、知乎、什么值得买、豆瓣、百度贴吧、高德地图、京东、IT之家。存在具体缺陷的选项已降级，不视为成熟即装即用。
- 125 项本地分析状态：candidate 12（包含三项精选与九项独立待选）、excluded 41、unsupported 72。unsupported 是本轮无可靠可采用适配，包含尚未审查的工具/无开屏需求项，不能说这 72 个 App 都有广告。
- 原先“50 个可能开屏”是名称分类启发式，不能当作广告数量或实测结果，本轮不使用它作为覆盖率依据。

明确保留现有独立方案：YouTube、YouTube Music、虎扑、酷安、Spotify、哔哩哔哩。另排除金融/政务/系统/敏感账号及 115生活、CloudDrive、Infuse、SenPlayer 等影音服务。没有通过 Bundle ID 推断域名，也不使用 PROCESS-NAME。

## 有规则但本轮不整合的重点项

| App | 来源线索与处理 |
| --- | --- |
| 高德地图、闲鱼、小红书、知乎 | 存在独立综合方案，本轮只列供选择；其规则不并入通用模块 |
| 京东、什么值得买、豆瓣、百度贴吧、IT之家 | 有来源但混合业务处理、文件维护或模块完整性风险，见独立清单，不直接部署 |
| 大众点评 | 原始 regex 将 loadsplashconfig 与 indexopsmodules 混合，不能未经证据改变业务初始化 |
| 拼多多 | 开屏接口直接 Reject，无可信响应合同；暂不采用 |
| 前程无忧51Job | get_launch 与 get_prompt/adtrace 混合且重复；没有仅开屏且安全的原始条目 |
| 淘宝 | 开屏与视频接口混合，依赖综合脚本；不导入框架 |
| 识货 | 两条图片尺寸匹配可能是开屏，但尺寸不能证明独占开屏；待验证 |
| 中国移动、中国联通、华住会、山姆会员商店 | 混合配置、欢迎页、升级/窗口或账号接口，业务风险未排除 |
| 百度网盘、航旅纵横、美团、网易云音乐、微博 | 现有广告来源不能直接证明本轮所需的可靠纯开屏适配；不强行添加 |

未找到来源索引匹配的潜在开屏目标包括智联招聘、永辉线上超市、BOSS直聘、小黑盒、滴滴等；这不是全互联网无方案的声明。本轮已经审查多个社区项目，按范围/许可/近期维护证据选择，不逐个 App 抓包开发。

## 可追溯的来源匹配索引

以下仅列公开上游的应用规则标题、类型和固定行号；无安装版本、Bundle ID、设备或账号字段。规则类型匹配不代表实际开屏验证。固定文件与 SHA256 见 `rules/source-index.json`。

| App | 上游 sections / 标题行号 | 明确开屏接口线索行 |
| --- | --- | --- |
| 百度贴吧 | [Rule] 961；[Script] 8633 | 未确认 |
| 哔哩哔哩 | [Rule] 1047；[Header Rewrite] 3909；[Body Rewrite] 5476；[Map Local] 5992；[Script] 8650 | 5483 |
| 懂车帝 | [Rule] 1178 | 未确认 |
| 抖音 | [Rule] 1186 | 未确认 |
| 豆瓣 | [Rule] 1196；[URL Rewrite] 4280；[Map Local] 6281 | 未确认 |
| 高德地图 | [Rule] 1312；[URL Rewrite] 4377；[Map Local] 6364 | 4380 |
| 虎扑 | [Rule] 1466；[URL Rewrite] 4466；[Map Local] 6509 | 未确认 |
| 虎牙直播 | [Rule] 1474；[URL Rewrite] 4477；[Map Local] 6519 | 未确认 |
| 京东 | [Rule] 1628；[URL Rewrite] 4549；[Script] 8802 | 未确认 |
| 美团 | [Rule] 2081 | 未确认 |
| 咪咕视频 | [Rule] 2125；[Map Local] 6935；[Script] 8924 | 未确认 |
| 米家 | [Rule] 2136；[Map Local] 6952 | 6954,6956 |
| 网易云音乐 | [Rule] 2432,3196；[Map Local] 7169,7734；[Script] 8972,9220 | 未确认 |
| 闲鱼 | [Rule] 2440,3272；[URL Rewrite] 4876,5218；[Body Rewrite] 5615,5702；[Map Local] 7181,7865；[Script] 8992,9251 | 7193,7882 |
| 小红书 | [Rule] 2445,3281；[Map Local] 7195,7924；[Script] 9015,9277 | 9027,9289 |
| 知乎 | [Rule] 2459,3762；[URL Rewrite] 4881,5400；[Body Rewrite] 5626,5750；[Map Local] 7215,8335；[Script] 9046,9368 | 7218,8338 |
| QQ音乐 | [Rule] 2471；[URL Rewrite] 4902；[Map Local] 7251 | 4905,4906,4907 |
| 什么值得买 | [Rule] 2534；[Map Local] 7335；[Script] 9115 | 未确认 |
| 淘宝 | [Rule] 2735；[Map Local] 7486；[Script] 9185 | 7494,9187 |
| 云闪付 | [Rule] 3696 | 未确认 |
| 中国联通 | [Rule] 3812；[Map Local] 8394 | 未确认 |
| 中国移动 | [Rule] 3823；[URL Rewrite] 5427；[Map Local] 8426 | 未确认 |
| 百度网盘 | [URL Rewrite] 4090 | 未确认 |
| 必胜客 | [URL Rewrite] 4130；[Map Local] 5988 | 未确认 |
| 大众点评 | [URL Rewrite] 4200；[Map Local] 6154；[Script] 8695 | 4205 |
| 得物 | [URL Rewrite] 4224；[Map Local] 6177 | 未确认 |
| 国家医保服务平台 | [URL Rewrite] 4405 | 未确认 |
| 航旅纵横 | [URL Rewrite] 4435；[Script] 8771 | 未确认 |
| 华住会 | [URL Rewrite] 4490；[Map Local] 6553 | 未确认 |
| 京东金融 | [URL Rewrite] 4554；[Map Local] 6654 | 未确认 |
| 肯德基 | [URL Rewrite] 4572；[Map Local] 6678 | 未确认 |
| 拼多多 | [URL Rewrite] 4776；[Body Rewrite] 5597；[Map Local] 7038 | 4778 |
| 前程无忧51Job | [URL Rewrite] 4839；[Map Local] 7128；[Script] 8961 | 4841,4846 |
| 山姆会员商店 | [URL Rewrite] 4935；[Map Local] 7293 | 未确认 |
| 识货 | [URL Rewrite] 4951；[Map Local] 7348 | 未确认 |
| Spotify | [URL Rewrite] 5005；[Map Local] 7471；[Script] 9178 | 未确认 |
| 笑容加 | [URL Rewrite] 5279；[Map Local] 8019；[Script] 9319 | 未确认 |
| 猎聘 | [Map Local] 6748 | 未确认 |
| 麦当劳 | [Map Local] 6865 | 6867 |
| 全民生活 | [Map Local] 6964 | 未确认 |
| YouTube | [Map Local] 8260；[Script] 9351 | 未确认 |
| 铁路12306 | [Script] 8548 | 未确认 |
| IT之家 | [Script] 8788 | 未确认 |
| 酷安 | [Script] 8813 | 未确认 |
| Reddit | [Script] 9108 | 未确认 |
