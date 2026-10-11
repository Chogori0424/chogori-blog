# Surge iOS 开屏精简模块

2026-10-11 审查版：正式入口默认 **0 条规则、0 个新增 MITM 主机**，当前没有去广告效果。京东在独立候选入口提供 **1 条响应脚本、1 个精确主机**，等待真实 App 验证。其他候选只保留研究证据，没有可安装实现。

稳定入口保持不变，PR 合并后可订阅：

`https://raw.githubusercontent.com/Chogori0424/chogori-blog/main/surge/StartupAds-Lite.sgmodule`

PR 合并前的京东测试入口：

`https://raw.githubusercontent.com/Chogori0424/chogori-blog/feat/surge-startup-lite-20261011/surge/StartupAds-Lite.candidate.sgmodule`

不要同时启用旧版模块。候选脚本固定到已发布提交 `2449ffc52688be28fce990fd71c9809368359a2d`，避免引用 main 尚不存在的文件。修改脚本必须先发布源码提交，再更新引用并核对下载内容。

## 支持状态

| App | 状态 | 实现 | 正式启用 |
| --- | --- | --- | --- |
| 京东 | candidate | 最小响应脚本，单独测试入口 | 否 |
| 高德地图、闲鱼、什么值得买、微博 | candidate | 有开屏来源，合同/精确主机仍待研究 | 否 |
| 网易云音乐、中国联通、百度贴吧 | unsupported | 已审查源文件，未获得独立开屏安全方案 | 否 |
| 其他待研究目标 | unsupported | 本轮没有通过审查的方案 | 否 |
| Bilibili、影音核心、金融支付、账号安全、Safari | excluded | 主动排除 | 否 |

`verified` 仅用于真实 iPhone 验证；`candidate` 表示可信来源等待实测，可能尚无实现；`unsupported` 表示本轮未建立可靠方案，并不证明互联网没有规则；`excluded` 表示主动排除。公共 [支持矩阵](inventory/support-matrix.csv) 只含已审查规则的 App，不含完整安装清单、Bundle ID 或版本。

本地 CSV 共识别 125 项、0 重复：50 项列为可能有开屏的观察目标，46 项值得先测试；5 candidate、41 unsupported、79 excluded。广告可能性是人工分流启发式，未证实当前安装版本有广告。3 个名称待确认。完整逐 App 结果只在被 Git 忽略的本地分析表。

## 目录与维护

```text
surge/
  StartupAds-Lite.sgmodule / StartupAds-Lite.candidate.sgmodule
  scripts/startup-lite.js / generate.mjs / analyze-inventory.py
  rules/jd.json / research.json
  inventory/support-matrix.csv
  tests/startup.test.mjs / inventory_test.py
  README.md / CHANGELOG.md / SOURCE-AUDIT.md / TEST-REPORT.md
```

原始 CSV、`inventory/apps-analysis.csv`、`analysis-summary.json`、完整本地报告不提交。分析器只写本地，公共矩阵从审查规则源独立生成。支持 UTF-8/BOM、UTF-16 BOM、GB18030；版本保留字符串，按 Bundle ID 去重，冲突单独报告。Bundle ID 不用于推断域名，不使用 PROCESS-NAME。

```sh
python3 surge/scripts/analyze-inventory.py /path/to/local.csv
python3 surge/tests/inventory_test.py
node --check surge/scripts/startup-lite.js
node --test surge/tests/startup.test.mjs
node surge/scripts/generate.mjs 2449ffc52688be28fce990fd71c9809368359a2d
```

生成器拒绝未固定的脚本引用，并拒绝把非 verified 规则发布到正式入口。没有自动合并上游规则或新增 GitHub Actions。每次只研究一个 App，核对具体文件的提交时间，不能把仓库活跃时间等同于规则维护时间。

## iPhone 验证流程

本轮 Mac Dashboard 已通过 USB 连到 iPhone，检查过 CLI 和现有转发监听。按京东/高德主机筛选时没有启动记录，没有安装候选模块或改动设备配置。CLI 对 USB 请求的认证读取没有完成验证，不预设 6170 固定有效，不提取已保存密码。连接成功不等于去广告实测成功。

1. 保持现状冷启动京东，记录开屏、首页与当前登录态。Dashboard 选择 iPhone 窗口，搜索 `api.m.jd.com`，不要使用本地 Mac 窗口数据。
2. 用户自行安装候选入口。仅在已有 MITM 证书正常受信任时测试，不改变证书校验或扩大 HTTPS 范围。`api.m.jd.com` 其他 HTTPS 请求也会被解密，正则只能限定脚本执行范围。
3. 核对 `/client.action`、唯一 `functionId=start`、状态 200、`images` 二维对象数组及脚本命中。只记录字段名、类型与计次变化，不导出 HAR、完整查询参数、Cookie、Token、账号数据或响应正文。
4. 启用/停用候选各重复冷启动 3 次，检查开屏、首页耗时、登录、搜索、商品详情；Wi-Fi 与蜂窝各一次。影音服务仍按原路径验证。缓存优先用 App 自带清理，不要求卸载或退出账号。
5. 开屏效果与核心功能都通过后，在本地记录日期、App/Surge 版本、方法和结论，再人工标为 verified。没有目标请求或一次没看到广告不能证明规则有效。

脚本仅修改数字计次/时长，不改日期、countdown 或业务字段。未知 JSON、结构变化、业务错误、非 200、重复 functionId、其他方法/URL 均 `$done({})` 原样放行。返回只含 `{body: ...}`，不重写头，无网络访问、存储或日志。响应超过 262144 字节按官方文档跳过，未在 iOS 实测这个边界。

## 冲突、回滚与下一批目标

Surge 每个响应仅执行第一个匹配脚本。其他去广告模块、Map Local、Rewrite/Body Rewrite 可能抢先处理。模块内部无重复，与 iPhone 现有有效配置的冲突尚未验证。异常时先停用候选，重新启动 App，不改变代理、DNS、GEOIP、FINAL 或 B 站模块。AdGuard 继续只负责 Safari。

旧规则完整保留在 Git 历史 `8bfd0882147bfd95dc7bcc31b073e9aa3efb9b43`，见 [来源审计](SOURCE-AUDIT.md)。旧版有已知风险，恢复安全状态应停用候选或使用零规则入口。

下一批按顺序：京东、高德地图、闲鱼、什么值得买、微博、知乎、豆瓣、IT之家、酷安、航旅纵横。前五项有开屏来源线索，后五项先确认是否实际展示开屏，再定位独立接口。未经审查不添加正式规则。

依据：[Surge URL Rewrite](https://manual.nssurge.com/http/url-rewrite.html)、[请求脚本](https://manual.nssurge.com/scripting/http-request.html)、[响应脚本](https://manual.nssurge.com/scripting/http-response.html)、[处理顺序](https://manual.nssurge.com/http/overview.html)。见 [测试报告](TEST-REPORT.md)。
