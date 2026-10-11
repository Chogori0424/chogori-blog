# Surge iOS 开屏精简

从持续维护的社区原生 Surge 规则中按本地应用清单筛选，只维护统一入口 `StartupAds-Lite.sgmodule`。本轮采用 fmz200 合集中的三条原始规则，逐字保留，不开发广告接口或 JavaScript，不导入整个综合框架。

| App | 原生方案 | 规则数 | 精确 MITM hostname | 状态 |
| --- | --- | --- | --- | --- |
| QQ音乐 | URL Rewrite：仅 t_splash_info 开屏素材 | 1 | y.gtimg.cn | candidate，来源已审查，本机未测试 |
| 麦当劳 | Map Local：home/splash 返回上游 200 单空格 | 1 | api.mcd.cn | candidate，来源已审查，本机未测试 |
| 米家 | Map Local：realtime/openingBanner 返回上游 200 空对象 | 1 | home.mi.com | candidate，来源已审查，本机未测试 |

合计 3 条、3 个 hostname、0 个 HTTP 脚本、0 个外部运行依赖。三条规则均完成源码/语法审查并进入统一模块；**没有声称当前 iPhone 去广告成功**。`candidate` 是实机状态，并不表示来源未审查；来源未审查或风险未明的规则不会生成到模块。`verified` 只用于真实设备确认；`unsupported` 表示本轮无可靠可采用的开屏适配；`excluded` 为主动排除。

YouTube、YouTube Music、虎扑、酷安、Spotify、哔哩哔哩明确排除。不修改其独立模块。115、Emby、STRM/CDN、Infuse、SenPlayer 及金融/支付/账号安全也不纳入。本次没有改动现用 Surge 的代理、DNS、策略组、GEOIP、FINAL，也没有安装任何推荐独立模块。

## 订阅入口与兼容性

合并后正式地址：[StartupAds-Lite.sgmodule](https://raw.githubusercontent.com/Chogori0424/chogori-blog/main/surge/StartupAds-Lite.sgmodule)。PR 尚未合并时 main 仍是旧内容；审核预览使用 [PR 分支入口](https://raw.githubusercontent.com/Chogori0424/chogori-blog/feat/surge-startup-lite-20261011/surge/StartupAds-Lite.sgmodule)，不要把旧 main 当成本轮结果。

Map Local `data-type=text` 要求 Surge iOS 5.9.1+。参见 [官方 Map Local 文档](https://manual.nssurge.com/http/map-local.html) 与 [URL Rewrite 文档](https://manual.nssurge.com/http/url-rewrite.html)。原生 text 响应无需 `$done()`。HTTPS 命中需要已正确配置 MITM 信任与 Rewrite；本项目不会修改或自动安装证书。hostname 使用 `%APPEND%` 加三个精确主机，不自动扩大到域名后缀。

麦当劳与米家保留上游前缀语义，扩展路径也可能匹配；未自行加锚点改变原规则。麦当劳单空格响应是否被当前 App 正确接受尚待测试。QQ音乐仅拒绝素材子目录，未复制任意域名/IP 变体，不会覆盖所有可能的开屏变体。

## 文件与维护

```
surge/
  StartupAds-Lite.sgmodule
  scripts/generate.mjs            # 本地生成，不在 Surge 内运行
  scripts/analyze-inventory.py    # 本地 CSV 分析
  rules/community.json           # 三条原始规则、来源、状态与样例
  rules/source-index.json         # 公开来源的按 App 审查索引
  inventory/support-matrix.csv   # 脱敏支持矩阵
  tests/                         # 正反例、原始行校验与本地分析测试
  licenses/fmz200-GPL-3.0.txt
  NOTICE.md / SOURCE-AUDIT.md / APP-MATCHING.md
  INDEPENDENT-MODULES.md / TEST-REPORT.md / CHANGELOG.md
```

原始 CSV、完整分析表与包含版本/Bundle ID 的统计均在 `inventory/` 本地忽略，禁止手动 `git add -f`。公开文件不含完整安装目录、Cookie、Token、版本或 Bundle ID。

更新流程：人工查看上游对应文件的提交与反馈 → 对照新本地 CSV → 逐条审查开屏作用范围、业务/许可风险 → 修改 community.json → 生成与测试 → PR 人工审核。生成器只读本地精选源，不下载或自动合并上游新增规则。独立模块只在 [选择清单](INDEPENDENT-MODULES.md) 推荐；用户未选择之前不整合。

```sh
node surge/scripts/generate.mjs
node surge/scripts/generate.mjs --check
node --check surge/scripts/generate.mjs
node --test surge/tests/startup.test.mjs
python3 -m unittest discover -s surge/tests -p '*_test.py'
python3 surge/scripts/analyze-inventory.py /本地/应用清单.csv
```

可选原始行证据校验：手工下载 rules/community.json 指定的 raw_url 到本地临时文件，然后设置 `SURGE_SOURCE_SNAPSHOT=/临时/文件` 运行 Node 测试，校验整文件 SHA256 和原始行。测试不执行上游代码。

## 实机验证与回滚

本轮不要求逐 App 抓包开发。先由用户选择是否启用此 PR 预览模块，再分别冷启动 QQ音乐、麦当劳、米家，检查开屏及播放/点单/设备控制和登录功能。Dashboard 只核对上述路径是否命中、状态码与内容类型，不保存 Cookie、账号或完整日志；静态测试不能替代这些结果。

如业务异常，先禁用本模块并冷启动 App，必要时清除对应 App 广告缓存；不修改代理和 DNS。若日后选择对应独立模块，先从本通用模块移除该 App 的精选规则，避免重复命中。历史实现可从 Git 恢复；此前 candidate 入口与自写京东脚本已退出本轮方案，不再推荐订阅。AdGuard 保持 Safari 内容过滤职责，本模块没有新增网页规则，但相同主机的 HTTPS 仍按 Surge 主机级 MITM 处理，无法按 iOS 进程隔离。
