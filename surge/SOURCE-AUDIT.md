# 社区来源筛选审计

检索及原始文件核实日期 2026-10-11。以现有社区规则为基础，只筛选和精简；没有自写广告接口。最近仓库推送不能替代具体文件维护时间，也不替代当前版本效果和用户反馈。

| 来源 | 实际文件及近期维护证据 | 本轮决策 |
| --- | --- | --- |
| [fmz200/wool_scripts](https://github.com/fmz200/wool_scripts) | 原生 `Surge/module/blockAds.module`；固定树 5d5f63f…；文件最近提交 [3ca7487…](https://github.com/fmz200/wool_scripts/commit/3ca7487b4e4b86d9af76e50df72c62eacfbb659e)，2026-09-10；仓库推送 2026-10-01；GPL-3.0 | 按 CSV 标题对照，提取三条原生开屏规则；不复制全集、脚本、DNS/账号/视频规则；多处重复条目不导入 |
| [Walvez/surge-startup-ads](https://github.com/Walvez/surge-startup-ads) | dist/StartUpAds_Selected.sgmodule 最后提交 d68d7cb…，2026-10-08；但头部日期 2026-08-29，含 reject-200/reject-dict/reject-img 等 URL Rewrite 类型；未检出 LICENSE | 不因近期更新就采用；与官方 Surge Rewrite 类型合同不同，不能直接视为原生可用；不复制转换器与全部规则 |
| [app2smile/rules](https://github.com/app2smile/rules) | 原生 module/tieba.sgmodule 最后提交 4acb496…，2026-01-06；脚本更旧，仓库 API 许可标识 MIT | 仅独立备选；[新版失效反馈](https://github.com/app2smile/rules/issues/266) 和 [Shadowrocket HTTP/2 登录反馈](https://github.com/app2smile/rules/issues/271) 降低推荐，后者不是 Surge 故障证明 |
| [QingRex/LoonKissSurge](https://github.com/QingRex/LoonKissSurge) | 原生转换模块，高德文件 1501294…，2026-03-03；仓库 2026-04-19 推送，未检出 LICENSE | 仅独立备选；外部 Kelee 脚本和 DNS/定位业务风险、许可需审核 |
| [ifflagged/Romeo](https://github.com/ifflagged/Romeo) | 2026-10-11 更新的大量镜像；未检出 LICENSE | 镜像更新时间不当作原作者维护时间；不使用镜像作为唯一证据 |
| blackmatrix7 | [startup.js](https://github.com/blackmatrix7/ios_rule_script/blob/016829d3584e4f9e8853c0836471ee0120e4963a/script/startup/startup.js) 2025-07-15；[Advertising.sgmodule](https://github.com/blackmatrix7/ios_rule_script/blob/master/rewrite/Surge/Advertising/Advertising.sgmodule) 路径最后提交 2025-12-21，内容自报 2025-08-26 | 框架和主机范围过大，不采用；此前基于其线索自写的京东实现已删除 |
| [ddgksf2013/Rewrite](https://github.com/ddgksf2013/Rewrite) | AmapAds/GoofishAds/SmzdmAds/WeiboAds/NeteaseAds/ChinaUnicomAds/TieBaAds 路径最近提交 2025-12-12；旧 StartUp.conf 当前不存在，README 指向的 StartUpAds.conf 实际跳转 HTML 索引 | 不直接复制 QX 类型；失效入口不作为配置订阅；活跃转换项目引用此地址也不等于有效 |
| [chavyleung/scripts](https://github.com/chavyleung/scripts) | 仓库推送 2026-09-30，README 最近路径提交 2023-05-26；以签到/账号脚本为主 | 不引入登录、Cookie 或不相关任务依赖 |
| [NobyDa/Script](https://github.com/NobyDa/Script) | Surge/Module/RewriteRules.sgmodule 自报 2021-08-26，文件最近提交 2022-01-25，仓库推送 2026-08-12 | 老泛主机/图片/视频规则不适合轻量开屏；不存在的 Startup.sgmodule 不作为来源 |

## 精选条目

原始文件：https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/blockAds.module 。三条来源行 L4905（QQ音乐）、L6867（麦当劳）、L6956（米家）逐字保留。其源文件提交和 SHA256、正反例、风险、实机状态存于 `rules/community.json`，上游 GPL 文本随分发保留。

两条 API 使用原生 Map Local 空响应，避免将初始化 API 改成硬 Reject；QQ音乐只拒绝明确开屏素材目录。API 空响应是否被当前版本接受仍需实测，静态正反例不会被标为 verified。没有广告脚本，因此没有 `$done()`/JSON 异常修改风险，也没有未合并 main 脚本依赖。

## 旧 PR 的调整

旧高德泛主机、未安装顺丰、将美团与美团外卖混同、闲鱼猜测空 JSON 等规则仍保持移除。此前防御性京东 JS、candidate 单独入口与 JSON 源已删除，原实现保留在 Git 历史；不继续开发新框架。正式入口恢复为少量经过来源/范围审查的社区规则，不再要求所有条目必须先实机 verified 才能进入审核 PR，但清楚标注 candidate。其他成熟独立模块只列推荐，不整合。

## 2026-10-12 完整广告范围与已有模块隔离

用户明确授权“整合各 App 完整去广告规则，但保留金融、账号安全和影音排除”，并要求维护 GitHub 后合并。截图确认的独立 App 与此前 Spotify/Bilibili 不再纳入通用模块。前述三条精选方案已由本节扩展方案取代，不能继续用“三条/九项待选择”描述当前版本。

全部 45 个匹配项均有维护归属：18 个匹配项排除；27 个按 App 保存原始 257 行。原始行未改写，人工只设置 enabled 与禁用原因；98 行启用，159 行不启用。完整文件路径、行号、源提交、许可、审核日期在 rules/apps/*.json，不再只存标题索引。

四个无可启用原生条目的 App：懂车帝（共享图片 CDN 关键词）、抖音（共享 CDN/设备风控）、铁路12306（kokoryh/Script API 未检出许可证，js/12306.js 对 JSON.parse 没有异常放行）、Reddit（fmz200 Scripts/reddit.js 最后提交 cd32a8c7e5959712dca9839c37a0d0d4c3934a36，2025-06-30；同时修改 NSFW 偏好且异常后仍可能返回部分修改对象）。都维护来源，不执行脚本、不自己发明替代接口。

咪咕视频个人中心脚本在实际读取后发现完整 Env 框架且坏 JSON 可能变成引号包裹的字符串；淘宝和网易云依赖综合框架或二进制脚本；其他外部脚本的维护/许可/业务风险未通过。全部不启用，只生成原生 Rule / Rewrite / Map Local。这是保留原业务及低维护成本的筛选结果，不声称 App 全部广告已解决。

百度网盘 certuser/get、订单权益、视频 CDN；中国联通 accountListData/getclientconfig；中国移动 startInit；笑容加固件/App 升级；华住/山姆/51Job 版本检查等均不生成。QQ音乐泛主机/IP、全平台腾讯广告后缀、共享埋点，以及 115/Emby/播放器内容均不引入。所有禁用条目保存原始行和原因，便于未来人工复核，禁止自动启用。

百度 pcs/ad 和 pcs/adx 原始前缀有同动作重叠，静态测试确认均为 reject；此处保留上游两条以覆盖不同版本，不虚称完全无交叉匹配。中国联通 m1.ad 主机的 Domain Reject 移除，保留更窄素材 Map Local，避免遮蔽。其他业务响应或推荐/广告兼容性仍等待实机。
