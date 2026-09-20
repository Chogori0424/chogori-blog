---
title: '从 Windows 常驻到 Linux Agent：我的 115 + MoviePilot + OpenClaw + Codex 媒体库架构'
description: '记录一套面向长期维护和可迁移性的家庭媒体库方案：115 作为最终资产库，MoviePilot 负责媒体自动化，OpenClaw 统一 Telegram/iOS 入口，Codex 管理部署与排障，NFO 与 Artwork 独立于 Emby。'
category: '个人日志'
tags: ['家庭影音', '媒体服务器', '115', 'MoviePilot', 'OpenClaw', 'Codex', 'Emby', 'STRM']
pubDate: '2026-09-21'
---

过去几个月，我的家庭媒体库从“把网盘挂到 Windows 上能播就行”，逐渐变成了一个需要长期维护的系统。

现在的媒体量已经不适合继续依赖一台游戏 PC 24 小时常驻，也不希望把识别、刮削、播放、网盘转存和自动化全部绑死在某一个软件里。我的目标越来越明确：**媒体文件和标准元数据才是长期资产，具体软件都应该可以替换。**

这篇文章记录的是 2026 年 9 月这一版已经定稿、但还在等待迁移实施的架构。它不是“已经全部部署完成”的展示，而是从现有 Windows 方案迁移到低功耗 Linux 小主机前的一次完整设计复盘。

## 当前基础：已经跑通的 Windows 媒体链路

现在的主库放在 115 网盘，Windows 上已经跑通了 Emby + STRM 的云媒体模式。OpenList 负责网盘路径解析和 302 直链，CloudDrive2（CD2）提供本地挂载与一些特殊播放场景，Emby 负责媒体库展示，日常播放则主要交给 SenPlayer、CD2 和 iOS 端的 Rex。

这套方案的优点是已经能稳定看电影，而且真正的视频文件不需要长期落在本地硬盘；问题也很明显：游戏主机需要承担服务器职责，多个工具之间的边界不够清楚，新增资源时还有不少人工操作。

我的桌面主力已经转向 MacBook Air M5，Windows 台式机则更适合只在游戏时开机。因此我购入了一台由笔记本主板改装而来的松下 Let’s note SV7 i5 小主机，准备让它承担 24 小时在线的媒体服务。小主机本身不负责存放完整影视库，本地 NVMe 主要用作系统盘、STRM、元数据以及百度/夸克跨网盘中转缓存。

这一步的核心不是“换一台服务器”，而是顺便重新定义整个媒体系统的职责边界。

## 最重要的原则：Emby 不能成为元数据真相源

我现在最在意的是可迁移性。

如果片名、年份、合集、演员、海报等信息只存在 Emby 数据库里，那么重装 Emby、换服务器，甚至以后从 Emby 切到 Jellyfin 或 Kodi，都可能意味着重新匹配和重新刮削大量内容。

因此最终决定是：

> **文件系统 + 标准 NFO + Artwork 才是媒体库的真相源，Emby 只负责读取和播放。**

一部电影最终应该至少保留：

```text
Movies/
└── Interstellar (2014)/
    ├── Interstellar (2014).mkv
    ├── Interstellar (2014).nfo
    ├── poster.jpg
    └── fanart.jpg
```

而本地 STRM 媒体库同步保存对应的元数据：

```text
strm/
└── Movies/
    └── Interstellar (2014)/
        ├── Interstellar (2014).strm
        ├── Interstellar (2014).nfo
        ├── poster.jpg
        └── fanart.jpg
```

这样以后真正需要长期保存的只有两类东西：115 上的媒体资产，以及标准化的 NFO/图片。Emby 数据库、MoviePilot 数据库乃至具体 STRM 工具都可以重建。

## 最终架构：一个入口，多个明确分工的执行层

整套系统最后收敛成下面这条链路：

```text
                     我
            ┌────────┴────────┐
         Telegram        OpenClaw iOS
            │                 │
            └────────┬────────┘
                     ▼
              OpenClaw Gateway
                 统一交互入口
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  MoviePilot MCP   Codex       Cron/Webhook
   媒体业务控制    工程/运维      自动检查
        │            │
        │       Docker / Git
        │       脚本 / 配置
        │       部署 / 排障
        │
        ▼
  资源获取与转存层
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
115分享  Magnet       百度 / 夸克 / 本地上传
直转存   115离线             │
 │       │              Transfer Worker
 └───┬───┘                   │
     └──────────────┬────────┘
                    ▼
               115 / 待整理
                    │
                    ▼
                MoviePilot
             识别 / 规则 / 整理
                    │
                    ▼
             独立 Metadata Scraper
              NFO + Artwork
                    │
                    ▼
              115 正式媒体目录
                    │
                    ▼
              P115StrmHelper
          增量同步 / STRM / 302
                    │
                    ▼
               本地 STRM 库
                    │
                    ▼
                  Emby
          只读 NFO / 图片 + 播放
                    │
                    ▼
                 115 CDN
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      SenPlayer    CD2       Rex
```

这张图看起来组件不少，但我现在反而比以前更在意“每个组件只做自己最擅长的一层”。减少层级并不等于强行找一个软件包办一切，而是避免两个软件重复管理同一份状态。

## OpenClaw：以后 Telegram 和 iPhone 的统一控制入口

日常使用中，我不想记住多个 Bot，也不想为了一个简单任务打开 MoviePilot、Emby、OpenList 和服务器面板。

因此 OpenClaw 的定位非常明确：**它是常驻在服务器上的总调度入口，而不是媒体处理软件本身。**

以后在 Telegram 里发送：

```text
把这个夸克链接转到 115。
```

或者：

```text
帮我订阅这部剧，优先 4K Dolby Vision，没有就 HDR10。
```

OpenClaw 负责理解意图，再调用具体执行层。

普通媒体任务交给 MoviePilot MCP；百度、夸克跨盘任务交给 Transfer Worker；媒体库刷新可以调用 Emby API；如果问题已经涉及 Docker、配置文件、脚本或代码，则交给 Codex。

OpenClaw 官方已经提供 iOS 客户端，可以连接自建 Gateway，并提供会话、工具调用和移动端节点能力。对我来说，Telegram 更适合快速发命令，iOS 客户端则更适合作为完整的 Agent 管理入口。

## Codex：服务器里的“工程师”，而不是另一个总管

我不希望 OpenClaw 和 Codex 两个 Agent 同时随意修改服务器。

最终约定是：

**OpenClaw 负责调度，Codex 负责工程。**

真正涉及基础设施变化的工作，例如：

- Docker Compose 维护；
- MoviePilot、Emby、OpenList 等服务的安装和升级；
- Transfer Worker 开发；
- Linux 服务与网络排障；
- Git 提交、回滚；
- 自动化脚本和 MCP 接入；

统一交给 Codex。

服务器配置本身则进入 Git 仓库。未来即使 SV7 损坏、换成其他 x86 小主机或 NAS，也应该能够依靠配置仓库重新搭建。

计划中的目录大致是：

```text
/opt/media-stack/
├── compose.yml
├── .env
├── openclaw/
├── moviepilot/
├── emby/
├── openlist/
├── p115/
├── transfer-worker/
├── metadata/
├── strm/
├── scripts/
├── monitoring/
├── backups/
└── docs/
```

其中 Token、Cookie、账号授权等信息只存在 secrets 或环境变量中，不进入 Git。

## MoviePilot：媒体自动化中枢

MoviePilot 的任务不是播放，而是管理“我要什么媒体，以及它怎么进入最终媒体库”。

它承担搜索、订阅、资源规则、任务触发和媒体工作流。尤其在接入 MCP 之后，OpenClaw 不必模拟网页点击，而是可以直接通过标准接口查询媒体、创建订阅或检查任务状态。

这层对我很重要，因为我的资源入口并不统一。

有些资源来自 Telegram 中的 115 分享，有些是 Magnet/ED2K，有些需要从百度或夸克拿回来，还有一部分可能是本地文件。所有这些入口最后都需要汇聚到同一个 115 待整理目录，再进入统一的识别和整理流程。

## 115：唯一的长期媒体资产库

过去我同时依赖百度和 115，但两者的职责现在已经明确分开。

百度、夸克等网盘更多是**资源来源**；115 则是**最终长期媒体库**。

因此几个常见入口会分别处理：

```text
115 分享
→ 115 直接转存
→ 待整理

Magnet / ED2K
→ 115 离线下载
→ 待整理

百度 / 夸克分享
→ 保存到来源网盘
→ SV7 临时下载
→ 上传 115
→ 校验成功
→ 删除本地缓存
→ 待整理
```

百度和夸克到 115 不强求所谓的“跨网盘秒传”。如果必须经过本地，就把这个中转过程做成自动化任务，让服务器自己处理。

SV7 上的 SSD 因此只承担短期 staging cache（中转缓存），而不是长期存储影视文件。

## OpenList：从播放核心退回多网盘适配层

OpenList 现在仍然是我现有链路的重要部分，但未来它不再承担“整个媒体库能不能播放”的核心职责。

更合理的角色是：

> **多网盘访问和 API 适配层。**

Transfer Worker 可以通过它或各网盘 API 访问百度、夸克等来源。这样即使 OpenList 某次升级出现问题，也只影响新增资源的搬运，不应该影响已经入库的影片播放。

这也是我现在判断架构是否健康的一个标准：**一个辅助组件挂掉时，故障范围应该尽量局部化。**

## P115StrmHelper：负责 115 到 STRM 的执行层

对于 115 主库，P115StrmHelper 更适合承担具体执行工作，包括 STRM 生成、增量同步、115 相关任务以及 302 播放链路。

它不是整个系统的“大脑”，而是一个专门处理 115 的执行器。

这样 MoviePilot 负责业务规则，P115StrmHelper 负责把 115 媒体变成 Emby 可以消费的 STRM 目录，两者职责不会混在一起。

## 独立刮削器：初期继续沿用 tMM 思路

我目前不会让 Emby 自己成为主要刮削器。

元数据层仍然独立存在，初期可以继续沿用 tinyMediaManager（tMM），后续如果换成其他工具，只要最终输出规则一致即可。

核心要求只有几个：

- 文件名和目录名稳定；
- 生成标准 NFO；
- 海报、背景图等 Artwork 落盘；
- 115 原媒体目录保留一份；
- 本地 STRM 目录同步一份。

我更关心最终产物，而不是一定要绑定某个 scraper。

## Emby：降级成一个可替换的前端和播放服务器

最终的 Emby 会比现在“轻”很多。

它主要负责：

1. 扫描本地 STRM 目录；
2. 读取已有 NFO 和 Artwork；
3. 提供媒体库 UI、用户状态和播放接口；
4. 把播放请求交给 302 链路。

在线刮削能力会被弱化甚至关闭。

这样某一天如果更换 Jellyfin，或者需要给 Kodi 建库，我不需要重新让新软件猜测几万份媒体到底是什么，只要读取已有标准元数据即可。

## CD2：继续保留，但不进入关键自动化链

CloudDrive2 仍然有价值。

它适合做网盘本地挂载、人工文件操作，以及 ISO、蓝光原盘等特殊播放场景。我现在使用 CD2 时，对原盘菜单和直接浏览体验依然很看重。

但我不会让“自动整理能不能工作”依赖 CD2 的 FUSE 挂载。

自动化链路尽量走 API；CD2 保留为很好用的人工工具和播放工具。这样哪一天更换挂载软件，也不会破坏媒体流水线。

## 为什么没有继续叠加 Symedia、CMS、FastEmby 和 Hermes

这些项目各自都有适合的场景，但最终没有进入主方案，不代表它们不好，而是我更希望避免职责重叠。

Symedia + FastEmby 很适合网盘媒体的一体化流程；CMS 很适合以 115 为核心快速完成增量、STRM 和 Emby 302；Hermes 也能作为优秀的 Agent Gateway。

但我的需求同时包含：

- Telegram 和移动端统一控制；
- 115 分享、磁力、百度、夸克、本地上传等混合入口；
- MoviePilot 的订阅和资源规则；
- 独立 NFO/Artwork；
- Codex 深度参与部署和开发；
- iOS 原生 Agent 客户端；
- 每一层尽量可以独立替换。

在这个前提下，继续叠加多个“全家桶”反而会出现重复刮削、重复转存、重复 STRM、重复 Bot 和多套状态数据库的问题。

因此最终选择不是功能最多的软件，而是边界最清楚的组合。

## 迁移实施顺序

SV7 到手后的第一件事，不是急着把所有服务装满，而是先建立可复现的基础设施。

第一阶段会先完成 Linux、Docker/Compose、Git 和 Codex，让之后的服务都由配置仓库管理。

第二阶段部署 MoviePilot、115 相关插件、STRM 和 Emby，先把“115 → STRM → Emby → 302 播放”这条最重要的主链路跑稳定。

第三阶段再接入独立元数据流程，以及百度/夸克的 Transfer Worker。

最后才是 OpenClaw、Telegram、iOS、Cron、Webhook 和自动监控，把已经稳定的服务逐步变成可以通过自然语言调用的系统。

我希望这个顺序能避免一个常见问题：Agent 很早就装上了，但底层服务本身还没有稳定，最终只能让 AI 帮忙不停救火。

## 最终想要的体验

这套系统真正完成后，我希望自己日常根本不需要考虑后台有多少容器。

看到一个资源时，只需要在 Telegram 发一句：

```text
把这个百度链接里的电影转到 115，整理后加入媒体库。
```

后台完成：

```text
百度
→ SV7 缓存
→ 115
→ 识别与整理
→ NFO / Artwork
→ STRM
→ Emby
→ 302
→ 播放
```

遇到异常时，也只需要问：

```text
为什么昨晚那部电影没有进入 Emby？
```

OpenClaw 先检查 MoviePilot、转存任务和媒体库状态；如果发现是服务器工程问题，再让 Codex 查日志、修改配置或代码。

最终理想状态可以概括成一句话：

> **我只表达需求，OpenClaw 负责调度，MoviePilot 负责媒体业务，Codex 负责工程；115 和标准 NFO 才是真正长期保存的资产。**

这也是我目前认为最适合自己的一条媒体库演进路线：不是继续增加软件，而是让每一层都更明确、更容易替换。

## 参考项目

- [MoviePilot](https://github.com/jxxghp/MoviePilot)
- [115 网盘 STRM 助手 / P115StrmHelper](https://github.com/DDSRem-Dev/MoviePilot-Plugins)
- [OpenClaw iOS 文档](https://docs.openclaw.ai/platforms/ios)
- [OpenList 文档](https://doc.oplist.org/)
- [Emby](https://emby.media/)
- [tinyMediaManager](https://www.tinymediamanager.org/)
