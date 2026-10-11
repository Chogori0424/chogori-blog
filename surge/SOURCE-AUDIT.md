# 来源与旧 PR 审计

审查日期 2026-10-11。已实际取得公开文件并查询关键路径提交。仓库活跃或作者声明不能证明当前安装版本有效。没有复制综合模块或执行框架。

| 来源 | 文件与维护证据 | 决策 |
| --- | --- | --- |
| blackmatrix7 | [startup.js](https://github.com/blackmatrix7/ios_rule_script/blob/016829d3584e4f9e8853c0836471ee0120e4963a/script/startup/startup.js) 与 startup.sgmodule 最后路径提交 016829d…，2025-07-15 | 参考京东 images 计次字段，自写防御实现；未导入 MagicJS、未来日期或 countdown=100 |
| blackmatrix7 | [Advertising.sgmodule](https://github.com/blackmatrix7/ios_rule_script/blob/master/rewrite/Surge/Advertising/Advertising.sgmodule) 自报 2025-08-26、740 reject/698 MITM | 取得真实文件，含泛路径正则，范围过宽，不导入；最后路径提交 a75313d…，2025-12-21；仍不证明接口更新 |
| ddgksf2013 | AmapAds/GoofishAds/SmzdmAds/WeiboAds/NeteaseAds/ChinaUnicomAds/TieBaAds，路径最后提交均 2025-12-12 | 完整 SHA、URL、端点和决策见 rules/research.json；同日提交不表示每条接口均已更新 |
| ddgksf2013 | [旧 StartUp.conf 历史](https://github.com/ddgksf2013/Rewrite/commits/master/AdBlock/StartUp.conf)，最后路径提交 bbcd2bb…，2025-04-05 | 当前目录已无该文件；README 所指 StartUpAds.conf 跳转后实际是 HTML 索引，旧 gist 404，不当配置加载 |
| chavyleung | [仓库](https://github.com/chavyleung/scripts) 推送 2026-09-30，README 最后路径提交 2023-05-26 | 查看目录、README 与检索结果，以签到/账号任务为主；未建立独立开屏合同，不获取 Cookie |
| NobyDa | [RewriteRules.sgmodule](https://github.com/NobyDa/Script/blob/master/Surge/Module/RewriteRules.sgmodule) 自报 2021-08-26；仓库推送 2026-08-12 | 取得文件，含泛主机/图片/视频规则，范围过宽；猜测的 Startup.sgmodule 不存在。最后路径提交 6225185…，2022-01-25 |

本轮重点审查可追溯开屏源和综合规则。其他清单项目 unsupported 仅表示尚无通过安全审查的方案，不声称穷尽所有网络规则。后续必须逐 App 补充请求证据，不能按名称猜域名。

## PR #3 旧规则问题

旧文件完整保存在 [8bfd088…](https://github.com/Chogori0424/chogori-blog/tree/8bfd0882147bfd95dc7bcc31b073e9aa3efb9b43/surge)。没有改动个人现用 Surge 配置。

| 旧项 | 问题 | 处理 |
| --- | --- | --- |
| 高德 | 旧 valueadded 路径与新来源 aos 路径不同；m*.amap.com 过宽，直接 reject 安全性未知 | 移出默认模块，新来源保留研究 |
| 顺丰 | 未安装；ad/ 前缀涵盖所有子路径 | 移出默认模块，历史保留 |
| 闲鱼 | request 的 response 返回结构正确，但 iyes 空 JSON 业务合同无证据；当前源改到 acs 主机 | 不伪造空成功响应 |
| 美团外卖 | CSV 是美团主 App，不等于外卖 App；wmapi 不足以证明适配 | 移出默认模块 |
| 京东 | 仅首参数匹配、伪造日期、部分未知结构仍可能修改、缺乏测试 | 完整路径与唯一参数检查，业务错误/坏结构放行，默认禁用 |
| JS 地址 | 合并前 main 没有脚本 | 固定先发布的源码 SHA |

Surge URL Rewrite 是正则、替换、类型三段。Quantumult X 的 url reject-200/reject-dict 不能直接复制；本轮没有转换启用这类规则。request 本地响应套 response，response 修改直接返回 body，异常返回空对象。候选配置已经按官方语法静态检查。

只参考端点和结构线索，未移植上游付费、登录、视频限制或其他业务修改功能。作者归属与来源提交保留在规则元数据。
