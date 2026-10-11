# 独立模块选择清单

核实日期：2026-10-11。以下均与本地 CSV 产品名称匹配，**仅列出供选择，没有安装、没有复制其完整规则或脚本进入通用模块**。原生格式及仓库活跃不等于当前安装版本有效；所有推荐均未经过此 iPhone 实测。优先审核前三项，逐个选择后再做版本、脚本和功能检查。YouTube、YouTube Music、虎扑、酷安、Spotify、Bilibili 不在此表。

| App | 模块/项目与 GitHub 来源文件 | 去广告范围（源码声明/接口） | 最近维护情况（文件与脚本分开） | 风险 | 推荐程度 |
| --- | --- | --- | --- | --- | --- |
| 闲鱼 | [fmz200 · XianYu](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partX/XianYu.sgmodule) | 开屏、信息流、搜索/个人页推荐、横幅 | 模块 2026-06-25 | 2 个 MITM 主机；依赖 ishowshu/qx 外部脚本，Body Rewrite 涉及推荐/个人页，另有 HTTP DNS 阻断；第三方脚本许可与当前版本仍需单独审核 | 优先审核，有条件选择 |
| 小红书 | [fmz200 · Xiaohongshu](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partX/Xiaohongshu.sgmodule) | 开屏、信息流、惊喜弹窗、搜索推广，还含水印处理 | 模块 2025-10-18；脚本 2026-06-05 | 5 个 MITM 主机；QUIC 拒绝与详情预加载修改；重复脚本名称及额外水印功能需检查；不默认采用全部功能 | 优先审核，有条件选择 |
| 知乎 | [fmz200 · Zhihu](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partZ/Zhihu.sgmodule) | 开屏、信息流、横幅、会员推广、回答卡片 | 模块 2026-04-26；脚本 2026-01-19 | 涉及回答/标签/推荐与会员推广，含网页规则，可能与 Safari 内容拦截职责重叠；需裁剪与业务验证 | 优先审核，有条件选择 |
| 什么值得买 | [fmz200 · SMZDM](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partS/SMZDM.sgmodule) | loading 开屏线索、首页/搜索推广、弹窗及会员页推广 | 模块 2026-04-14 | 8 个 MITM 主机，含 qianbao 钱包域；多个重复脚本名称和更新接口修改；VIP 路径可见的是推广字段处理，不等于会员解锁；仍需完整依赖审查 | 降级待验证，钱包部分不默认解密 |
| 豆瓣 | [fmz200 · Douban](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partD/Douban.sgmodule) | App 广告、图片广告、电影横幅 | 模块 2025-10-18；2026-09-10 综合文件仍有相关条目 | 无 JS；模块 MITM 仅 api.douban.com，部分其他 HTTPS Rewrite 主机缺失；目录存在不能证明开屏效果 | 待验证，需补齐审查而非直接安装 |
| 百度贴吧 | [app2smile · tieba](https://github.com/app2smile/rules/blob/df6366a7024e0b3f0aa3510c5b791eea6f3cba89/module/tieba.sgmodule) | 开屏、帖子/信息流、直播、图片推广 | 模块 2026-01-06；JSON 脚本 2025-08-28；Proto 脚本 2025-11-18 | 1 个 MITM 主机，但依赖规则表与二进制脚本；[#266](https://github.com/app2smile/rules/issues/266) 有新版失效反馈；[#271](https://github.com/app2smile/rules/issues/271) 是 Shadowrocket HTTP/2 解密登录问题，不能等同于 Surge 已确认故障 | 暂不推荐直接启用；先确认适配 |
| 高德地图 | [QingRex · 高德地图去广告](https://github.com/QingRex/LoonKissSurge/blob/913ec005f544221e6c56a7d0ecec81c4b3b914bb/Surge/高德地图去广告.sgmodule) | 开屏、横幅、弹窗、推广及页面精简 | 模块最后提交 2026-03-03，文件自报 2026-02-22 | Kelee 转换来源，仓库未检出许可证；依赖 kelee.one 脚本，含 DNS/定位/页面相关规则；导航与业务功能风险须逐项审核 | 降级待验证，不默认采用 |
| 京东 | [fmz200 · JD.com](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partJ/JD.com.sgmodule) | 开屏与订单/个人页面推广处理 | 模块 2025-10-18；尚未取得正确脚本路径最近提交证据 | 2 个 MITM 主机，包括 dns.jd.com；混合 order/personInfo 与广告处理；不重用此前自写脚本 | 暂不推荐整套启用 |
| IT之家 | [fmz200 · ITHome](https://github.com/fmz200/wool_scripts/blob/5d5f63fcf98bc69d5f8f1b1bae6f86a01ee4bb97/Surge/module/split/partI/ITHome.sgmodule) | 信息流、轮播、置顶；未找到明确开屏条目 | 模块 2025-10-18；脚本 2026-06-01 | 模块没有 MITM 节，HTTPS 脚本不能视为即装即用；包含内容排序/删除 | 仅研究备选 |

fmz200 仓库 LICENSE 为 GPL-3.0；表格中的链接是供审核的源码，不是本模块的运行依赖。QingRex 未检出许可，app2smile 仓库 API 标识为 MIT，实际引入时仍需逐依赖核实许可。依赖脚本尚未全部完成安全/兼容性审核，故没有无条件推荐项；表中“优先审核”表示研究顺序。
