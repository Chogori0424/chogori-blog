# 测试报告

执行日期 2026-10-11 至 2026-10-12。仅本地/公开源码检查，没有安装独立模块，没有重新抓取 iPhone 请求，也没有完成当前 App 的真实去广告验证。

| 检查 | 结果 | 限制 |
| --- | --- | --- |
| Surge CLI `--check` | 通过 | 将生成模块的 sections 放入临时最小 profile，展开 `%APPEND%`，用现装 Mac Surge 离线解析；不是 iOS 运行证明；不加载到生产配置 |
| Node 生成器语法 | `node --check` 通过 | Surge 中没有 HTTP JavaScript，旧京东 JS 已删除 |
| Node 测试 | 5 项通过（包含固定源快照校验） | 正例/非目标域名、登录、播放、菜单/设备反例；规则交叉不匹配；源文件 SHA256 与三行逐字一致 |
| Map Local 模拟 | 200 单空格与 200 JSON 空对象/Content-Type 通过 | 没有执行 App；不能证明业务接受模拟响应 |
| Python CSV 测试 | 4 项通过 | UTF-8/BOM/UTF-16/GB18030、去重、版本字符串、缺列、冲突、影音和六个现有独立方案排除 |
| 生成一致性 | `generate.mjs --check` 通过 | 源变更后必须再生成 |
| 重复与冲突 | 三条规则、三主机，内部无重复/交叉样例命中 | 没有读取或改动用户其他独立模块，跨模块冲突需启用前确认 |
| 来源可访问 | 固定 fmz200 原始模块、GPL 文件及推荐模块源码实际获取成功 | 链接可访问不等于当前 App 有效；未来失效不影响本模块运行，因为无远端依赖 |
| 隐私 | 原始 CSV/完整分析被 gitignore；公开矩阵只有三条规则支持信息 | 禁止强制提交本地 inventory 文件和网络日志 |
| 博客构建 | 提交前执行 `npm run build` | 结果见 PR 验证记录 |
| 实机 | **未测试** | 三条均 candidate，0 条 verified |

实际命令：

```sh
node --check surge/scripts/generate.mjs
SURGE_SOURCE_SNAPSHOT=/tmp/surge-community/fmz200/Surge/module/blockAds.module node --test surge/tests/startup.test.mjs
python3 -m unittest discover -s surge/tests -p '*_test.py'
node surge/scripts/generate.mjs --check
/Applications/Surge.app/Contents/Applications/surge-cli --check /tmp/startup-community-check.conf
npm run build
```

API 两条原始正则为前缀匹配，测试明确保留 suffix 也命中；不声称对未来同前缀新业务路径绝对无影响。麦当劳响应单空格非 JSON，米家响应空对象不是真实初始化响应；发生异常先禁用本模块并冷启动对应 App。用户日后选择 QQ音乐/麦当劳/米家相关独立模块，应从此统一模块去掉重叠 App 条目，重新生成、检查后审核发布。

统一入口的 GitHub PR 分支下载与本地文件一致性在推送后复核；main 的正式订阅地址需等待 PR 合并才能取得本轮版本。不自动合并。
