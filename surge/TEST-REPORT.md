# 完整社区广告规则测试报告

执行日期 2026-10-12。源固定 fmz200/wool_scripts 原生 Surge 合集；不安装现用 iPhone 模块，不抓取或保存敏感请求，不执行上游第三方脚本。

| 项目 | 结果与限制 |
| --- | --- |
| 原始行/许可 | 27 个 App 的全部 257 条维护行逐字核对源快照；SHA256 与 GPL 原文校验通过 |
| 启用配置 | 98 条：43 条 Rule、27 条 URL Rewrite、28 条 Map Local；23 App；43 个精确 MITM 主机，无通配主机/脚本/HTTP DNS/IP 拦截 |
| Node 测试 | 7 组通过，包括全部 55 条 HTTP 原始规则的手工脱敏正例、伪造域名反例及登录/订单/升级/播放/既有独立模块请求反例 |
| 重复/交叉 | 无逐字重复启用规则；已知百度 pcs/ad 前缀与 pcs/adx 的重叠为同动作 Reject，不是脚本冲突；其他正例未发现交叉 |
| Domain 反例 | 共享 CDN、风控、HTTP DNS、受保护业务与独立模块核心主机不命中；无同主机 DNS Reject 遮蔽 MITM HTTP 条目 |
| 模拟响应 | 上游 200 空对象、单空格、tiny-gif 参数与 JSON Content-Type 检查通过；不能证明 App 接受 |
| Surge CLI 静态检查 | 将模块放入临时最小 profile，展开 %APPEND%，把 FINAL,DIRECT 放在 [Rule] 末尾；现装 Mac CLI --check 返回 OK。未加载到生产配置，不代表 iOS 实测 |
| JavaScript | node --check 生成器通过；没有 HTTP 运行脚本 |
| CSV | Python 4 组通过：常见编码/重复/版本字符串、缺列、冲突、影音保护和全部已用独立 App 排除 |
| 生成 | generate.mjs --check 通过，本地源与统一入口一致 |
| 隐私 | 原始 CSV、apps-analysis.csv、私有统计仍被 gitignore；Git 只包含脱敏支持矩阵 |
| 构建 | 提交前 npm run build，通过记录见 PR |
| 实机 | **0 条 verified，全部启用 App 未测试**。截图证明已有独立模块已选择，不证明其功能通过 |

```sh
node --check surge/scripts/generate.mjs
SURGE_SOURCE_SNAPSHOT=/tmp/surge-community/fmz200/Surge/module/blockAds.module node --test surge/tests/startup.test.mjs
python3 -m unittest discover -s surge/tests -p '*_test.py'
node surge/scripts/generate.mjs --check
/Applications/Surge.app/Contents/Applications/surge-cli --check /tmp/startup-full-check.conf
npm run build
```

已排除的 159 条包括重复、共享平台/业务精简、第三方脚本/框架、认证/初始化/更新与影音风险。四个 App 全部暂不启用，但原始来源完整维护：懂车帝、抖音、铁路12306、Reddit。不是静默遗漏，也不以“测试未做”假装已有效。

风险：Map Local 和广告 Reject 合同继承上游；中国联通 tiny-gif 广告响应、米家 myTab/轮播、华住推荐及其他内容精简可能与当前 App 不兼容。主机级 MITM 可解密同主机其他请求，不能按 iOS App 隔离；原始前缀/不完全转义/替代主机语义保留。静态业务反例有限，不能保证未知路径和跨模块不冲突。

回滚：业务异常先禁用本模块并冷启动，不更改代理/DNS/独立方案；可按 App 禁用源条目重新生成，或使用固定 5567d61 的三 App 版本。本轮用户明确授权完成后合并 PR，合并后再复核 main 下载与本地内容一致，不以合并成功代替真实 App 效果。
