# Surge 社区广告精简

2026-10-12 按用户明确选择，范围由“仅开屏”改为**各 App 完整社区广告规则的筛选整合**。保留 `StartupAds-Lite.sgmodule` 订阅路径，避免订阅地址再次变化。不是从零开发广告框架，不重新设计广告接口，不安装或改动用户现用配置。

45 个匹配 App 均有归属：截图及原有独立方案、金融/账号保护范围对应 18 个匹配项排除；其余 **27 个 App 的全部 257 条原始来源条目** 按 App 维护。逐行审查后启用 **23 个 App / 98 条规则 / 43 个精确 MITM hostname**，其余 159 条有禁用原因。没有 HTTP 脚本、综合运行框架或远端运行依赖。启用并不表示实机通过，全部仍为 candidate。

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

## 已有独立模块与保护边界

截图确认已添加：IT之家、YouTube / YouTube Music、京东、什么值得买、小红书、知乎、虎扑、豆瓣、百度贴吧、酷安、闲鱼、高德地图。继续保留 Spotify、Bilibili 的原独立方案。上述 App 不生成规则，也不替换、修复或重复部署其模块；截图只能证明用户已选择/启用，不能证明实际去广告或业务回归。

金融/支付/政务敏感范围继续排除（本次匹配项：云闪付、京东金融、全民生活、国家医保服务平台）。115生活、Emby、STRM/CDN、CloudDrive、Infuse、SenPlayer 等影音核心不纳入。未修改代理节点、策略组、DNS 设置、GEOIP、FINAL 或 AdGuard。模块新增的 [Rule] 只含审查后的广告/统计主机拒绝，不阻断 HTTP DNS、共享图片/视频 CDN、账号认证和软件/固件升级。

## 为什么四项只维护

- 懂车帝：只有共享图片 CDN 关键词，无法证明广告独占，可能误杀内容。
- 抖音：共享图片 CDN 与设备/风控域名，账号和内容风险。
- 铁路12306：第三方请求脚本仓库没有 LICENSE，JSON.parse 无异常放行；不擅自复制或创造替代接口。
- Reddit：原脚本同时修改 NSFW 偏好，错误后可能返回部分处理对象；文件最后维护 2025-06-30。保留原始来源但不执行。

其他 App 的非广告业务修改、混合账号/初始化、升级检查、视频 CDN、综合/未知第三方脚本、重复规则也不启用，逐条原因在 rules/apps/*.json。已授权完整去广告范围，不等于授权修改登录、权益或业务初始化。启用部分还包括推荐/推广与广告资源，具体边界见对应原始行；没有承诺全 App 广告全部消失。

## 订阅与安装

正式入口：[StartupAds-Lite.sgmodule](https://raw.githubusercontent.com/Chogori0424/chogori-blog/main/surge/StartupAds-Lite.sgmodule)。此前 main 中没有该文件导致 404；只有 PR 合并并确认下载后才是可用正式入口。

PR 开发预览：[分支入口](https://raw.githubusercontent.com/Chogori0424/chogori-blog/feat/surge-startup-lite-20261011/surge/StartupAds-Lite.sgmodule)。用户已经明确授权本轮完成后合并 PR；不会改变其他独立模块。安装/刷新订阅由用户在 iPhone 操作，本任务不代为启用。

原生 Map Local text/tiny-gif 需要 Surge iOS 5.9.1+。HTTPS 需要已正确配置 MITM 信任和 Rewrite。使用 `%APPEND%` 加 43 个精确 hostname，不增加主机通配符和金融域名。**MITM 是主机级**：命中 App 的非广告请求也可能解密，但规则仅针对选定 URL；不能用 Bundle ID 或 PROCESS-NAME 隔离 iOS App。跨 App 共用主机的影响不能靠静态测试完全排除。AdGuard 保持 Safari 职责；没有加入综合 Safari 网页过滤，但相同主机/路径可能影响浏览器请求。

## 文件及维护

```
surge/
  StartupAds-Lite.sgmodule
  rules/community.json          # 来源、App 源清单与排除清单
  rules/apps/*.json             # 27 App 全部原始条目、行号、启用/禁用原因
  rules/source-index.json        # 45 App 公开来源索引
  scripts/generate.mjs          # 本地生成，不在 Surge 内执行
  scripts/analyze-inventory.py  # 本地 CSV 分析
  inventory/support-matrix.csv # 脱敏支持/排除矩阵
  tests/                       # 正反例、原始行、生成一致性测试
  licenses/fmz200-GPL-3.0.txt
  NOTICE.md / SOURCE-AUDIT.md / APP-MATCHING.md
  INDEPENDENT-MODULES.md / TEST-REPORT.md / CHANGELOG.md
```

原始 CSV、完整版本/Bundle ID 表仍本地 gitignore，不使用 git add -f。公共文件仅描述来源规则的支持状态，没有上传全手机目录、账号、Cookie、Token 或网络日志。

来源固定为 fmz200/wool_scripts 的原生 Surge 合集，最后文件提交 2026-09-10，核实 2026-10-12；原始 257 行均未改写，GPL 原文保留。不自动同步上游新增规则，不从安装名称推测接口。源 JSON 是完整审查档案，**enabled=false 的条目不会出现在生成模块**。

```sh
node surge/scripts/generate.mjs
node surge/scripts/generate.mjs --check
node --check surge/scripts/generate.mjs
node --test surge/tests/startup.test.mjs
python3 -m unittest discover -s surge/tests -p '*_test.py'
python3 surge/scripts/analyze-inventory.py /本地/应用清单.csv
```

手工下载固定 raw_url 后，可用 `SURGE_SOURCE_SNAPSHOT=/临时/原始模块` 跑 Node 测试核对所有原始行和整文件 SHA256。生成器仅使用人工审查的本地源；不下载或执行第三方脚本。

## 验证与回滚

静态正反例、原始行/配置/模拟测试通过不等于 App 去广告成功。全部 23 个启用 App 均未完成当前设备的广告效果、登录与业务回归。用户启用后从实际常用 App 开始验证；Dashboard 只记录必要的脱敏路径、命中/状态，不持久保存私人请求。

所有原始前缀匹配、空对象/单空格/透明 GIF 和广告 Reject 的响应合同均继承上游，不能保证当前客户端接受。其中中国联通广告 API 继承 tiny-gif 响应，米家 myTab 与华住推荐移除可能影响页面内容；不能将这些副作用隐藏成“只开屏”。百度 pcs/ad 与 pcs/adx 存在同动作前缀重叠，测试确认都是 reject，保留以覆盖不同 API 版本；不同时导入遮蔽 Map Local 的同主机 Domain Reject。

如 App 出现异常，先禁用此统一模块并冷启动；不要改动代理、DNS 或已用独立模块。维护者可将对应 App 原始条目 enabled 设为 false，重新生成测试后提交审核。要回到此前三 App 范围，可使用固定 [5567d61 版本](https://raw.githubusercontent.com/Chogori0424/chogori-blog/5567d61fa688972285056cf47b6813789815b27d/surge/StartupAds-Lite.sgmodule)。旧自写京东/candidate 已删除，不再使用。
