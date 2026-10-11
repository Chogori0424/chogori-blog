# Chogori · Surge 开屏精简模块

个人使用、低维护成本的 iOS Surge 开屏广告模块。原则：**只处理命中的开屏请求，不叠加综合净化合集**。

- 模块：[`StartupAds-Lite.sgmodule`](./StartupAds-Lite.sgmodule)
- 脚本：[`scripts/startup-lite.js`](./scripts/startup-lite.js)
- 稳定订阅地址（**需 PR 合并到 main 后才可使用**）：
  `https://raw.githubusercontent.com/Chogori0424/chogori-blog/main/surge/StartupAds-Lite.sgmodule`

## 首批规则

| App | 实现 | 说明 |
| --- | --- | --- |
| 高德地图 | URL Rewrite | 仅拦截 splash_screen 接口 |
| 顺丰速运 | URL Rewrite | 仅拦截独立的 ad 接口 |
| 闲鱼 | HTTP 请求脚本 | 对 `iyes.youku.com/uts/v1/start/` 返回 `{}` |
| 京东 | HTTP 响应脚本 | 仅尝试关闭启动图片的展示次数/时间 |
| 美团外卖 | HTTP 响应脚本 | 仅尝试清空 `startpicture.ad/mk` 数组 |

**明确不处理：** Bilibili（避免既有规则/番剧冲突）、115/Emby/STRM/CDN、所有登录鉴权接口、App 首页推荐流、Safari 网页广告。百度网盘暂不收录：其开屏行为需要按当前 App 版本抓包验证，避免影响网盘功能。

## 安装

1. 合并包含本模块的 PR 后，在 Surge iOS 的「模块」中选择「从 URL 安装」，粘贴上面的稳定订阅地址。
2. 确认 Surge 的 HTTPS 解密证书已安装并信任，并打开 HTTPS 解密及重写功能。
3. 逐个彻底退出 App 再重新启动，观察开屏是否消失；有的开屏素材存在本地缓存，或走新的 API。
4. **未经过 iOS 27 实机流量验证。** 任何 App 出现异常，先关闭本模块复测，再用 Surge 请求记录定位。Surge 对同一个响应只执行第一个匹配的 HTTP 响应脚本；不要同时为同一接口启用其他模块。

## 与 AdGuard 搭配

- AdGuard 开启 **Safari 内容拦截 / Safari 高级保护**；Surge 继续负责代理、DNS、HTTPS 解密和开屏规则。
- AdGuard 的 **DNS 保护 / 本地 VPN** 不与 Surge 同时接管。不要把 AdGuard DNS 覆写进当前代理配置，尤其要保护 115 CDN 的直连链路。
- 本模块只追加 5 个 MITM hostname 范围，不开启全局 MITM，且不含 DOMAIN 广告拦截规则。
- 追加 MITM hostname 仍代表对这些域名的其他 HTTPS 连接也可能进行解密。发生 TLS/登录异常时优先关闭本模块回滚。

## 上游资料与维护

接口与字段结构参考：
- [blackmatrix7 - 开屏去广告](https://github.com/blackmatrix7/ios_rule_script/tree/master/script/startup)
- [BlueGrave/Surge - WhiteList.sgmodule](https://github.com/BlueGrave/Surge/blob/master/Module/WhiteList.sgmodule)
- [Surge 官方 HTTP Response Script 文档](https://manual.nssurge.com/scripting/http-response.html)
- [Surge 官方 URL Rewrite 文档](https://manual.nssurge.com/http/url-rewrite.html)

此处为独立编写的最小脚本实现，并不声称上游接口仍在最新版本 App 中有效。调整前请在 Surge 请求记录确认域名、路径与响应结构，避免直接复制数百条规则。

版本：v0.1.0（2026-10-11）。
