# NotebookLM 中文使用指南 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在博客中新增一篇面向中文读者的 NotebookLM 使用指南，并补齐 `AI 工具` 分类、中文优先内容规则和开发日志记录。

**Architecture:** 文章仍走现有 Astro 内容集合，不新增布局或运行时依赖。分类能力通过 `src/content.config.ts`、`src/consts.ts` 和 `PostCard.astro` 的现有集中定义扩展，页面继续从 `BLOG_CATEGORIES` 自动生成导航和分类路由。

**Tech Stack:** Astro 6 内容集合、Markdown、TypeScript、现有 `devlog:add` 脚本、`npm run build`。

---

## 文件结构

- 修改 `AGENTS.md`：新增中文优先内容规则，作为后续项目写作约束。
- 创建 `src/content/blog/notebooklm-career-ai-learning-guide.md`：新增 NotebookLM 中文长文。
- 修改 `src/content.config.ts`：文章分类枚举加入 `AI 工具`。
- 修改 `src/consts.ts`：`BLOG_CATEGORIES` 加入 `AI 工具` 分类、slug 和描述。
- 修改 `src/components/PostCard.astro`：新增 `AI 工具` 分类到卡片渐变映射。
- 修改 `src/pages/categories/index.astro`：分类页描述纳入 `AI 工具`。
- 修改 `src/data/devlog.json`：通过 `npm run devlog:add` 记录本次内容和分类新增。

## Task 1: 固化中文优先内容规则

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: 在 `AGENTS.md` 的 `Development Log` 和 `Verification` 之间加入内容语言规则**

将下面这一节插入到 `AGENTS.md` 中 `Development Log` 章节之后：

```markdown
## 内容语言

- 面向读者的站内内容默认使用中文，包括文章标题、摘要、正文、分类描述、按钮文案和页面说明。
- 产品名、技术名词、代码标识、命令、文件路径、URL、官方功能名和必要引用可以保留英文。
- 英文技术词第一次出现在正文时，尽量补充中文解释，例如 `vibe coding（氛围式 AI 编程）`、`AI Agent（智能体）`。
- 不为了显得专业而堆英文；可以自然翻译的概念优先中文化。
```

- [ ] **Step 2: 检查规则是否写入**

Run:

```powershell
Get-Content AGENTS.md -Encoding UTF8
```

期望看到新增的 `## 内容语言` 章节，原有开发日志、验证和安全规则保持不变。

## Task 2: 先新增文章并触发分类校验失败

**Files:**
- Create: `src/content/blog/notebooklm-career-ai-learning-guide.md`

- [ ] **Step 1: 创建文章文件**

创建 `src/content/blog/notebooklm-career-ai-learning-guide.md`，写入下面内容。正文保留必要产品名和官方功能名，其他表达面向中文读者。

~~~markdown
---
title: 'NotebookLM 使用说明：从简历优化到 vibe coding 与 AI Agent 学习'
description: '把 NotebookLM 当成资料驱动的学习和求职工作台：整理简历、拆解岗位、沉淀氛围式 AI 编程经验，并系统学习智能体。'
category: 'AI 工具'
tags: ['NotebookLM', 'AI 工具', '简历优化', '氛围式 AI 编程', '智能体学习', '学习方法']
pubDate: '2026-05-13'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

NotebookLM 最值得用的地方，不是让它凭空替你想答案，而是把它变成一个“围绕资料工作的研究台”。你把简历、岗位描述、项目记录、课程资料、框架文档、视频链接和错误日志放进去，它再基于这些来源帮你总结、比较、追问和生成学习材料。

如果只把 NotebookLM 当成普通聊天工具，它的优势会被浪费。更好的方式是把每个 notebook 当成一个独立项目：一个目标、一组来源、一套问题。这样它回答时更容易贴近材料，也更方便你回到来源里核对。

## NotebookLM 适合解决什么问题

NotebookLM 适合处理“我已经有一堆资料，但还没有整理成方法”的场景。比如你手里有一份简历、三份目标岗位描述、几个项目复盘草稿，还有一些零散技能点；普通聊天工具需要你反复复制上下文，NotebookLM 则可以把这些资料放在同一个 notebook 里，后续围绕它们持续提问。

它尤其适合四类任务。

第一类是资料归纳。比如把岗位描述里的硬性要求、加分项、工具栈和业务关键词整理成表格。

第二类是对比分析。比如比较你的简历和岗位要求，找出已经覆盖、表达不足和缺少证据的部分。

第三类是学习拆解。比如把一个框架文档拆成核心概念、必做练习和容易混淆的术语。

第四类是输出转换。比如把一组项目记录转成简历要点、面试问答、学习卡片、简报或思维导图。

按当前 Google 官方说明，NotebookLM 可以添加 PDF、网页、公开 YouTube 链接、音频文件、Google Docs、Google Slides、Microsoft Word、文本、Markdown、图片、Google Sheets 和粘贴文本等来源。它也提供 Chat 和 Studio 两类主要工作区：Chat 用来围绕来源提问，Studio 用来生成笔记、音频概览、视频概览、思维导图、报告、数据表、抽认卡、测验、幻灯片和信息图等输出。具体功能会变化，所以我更建议把它理解成“资料驱动的工作流”，而不是记一堆按钮位置。

## 基础使用流程

我的基本流程是五步。

第一步，先为一个明确目标创建 notebook。不要把“求职”“编程学习”“AI Agent”全部塞进一个空间。目标越清楚，后面的回答越稳定。

第二步，添加来源。简历优化可以放现有简历、目标岗位描述、项目说明和成果草稿；vibe coding 学习可以放框架文档、教程、README、报错记录和自己的项目笔记；AI Agent 学习可以放框架文档、工具调用示例、检索增强资料、评估文章和实验记录。

第三步，让 NotebookLM 先做来源体检。不要一开始就让它“帮我优化”。更稳的第一问是：

```text
请只基于当前来源，列出这些资料分别包含什么信息、哪些资料最关键、哪些资料质量不足。不要先给建议。
```

第四步，再做具体任务。比如提取岗位要求、改写项目经历、解释某个框架概念、整理调试记录。

第五步，把输出反过来沉淀成来源。你可以把确认过的结论、面试复盘、项目决策和学习笔记整理成 Markdown，再加回 notebook。这样 NotebookLM 不只是一次性问答工具，而会变成长期资料库。

## 一个 notebook 一个任务边界

NotebookLM 的质量很大程度取决于来源边界。如果一个 notebook 里同时有简历、React 教程、智能体论文、网络代理配置和音频设备笔记，模型检索时就更容易抓到无关材料。

我建议至少拆成这些 notebook：

| notebook | 放入资料 | 主要用途 |
| --- | --- | --- |
| 简历优化 | 简历、岗位描述、项目成果、技能清单 | 匹配岗位、改写经历、准备面试 |
| 目标岗位研究 | 多个目标岗位、公司介绍、招聘页、行业资料 | 分析岗位共性和能力缺口 |
| 项目作品集 | 项目 README、架构说明、截图说明、复盘 | 提炼项目价值和展示文案 |
| vibe coding 学习 | 框架文档、教程、报错日志、代码笔记 | 建立学习路线和调试复盘 |
| AI Agent 学习 | 智能体框架文档、工具调用、检索增强、评估资料 | 搭建知识结构和实验清单 |

边界不是越细越好，而是要让每个 notebook 能回答一个清晰问题：我现在想推进什么？

## 简历制作与优化工作流

简历优化是 NotebookLM 最容易产生实际价值的场景。因为简历不是单纯润色文字，而是把岗位要求、个人经历和项目证据对齐。

我会先准备这些资料：

- 当前简历，可以是 PDF、文档或纯文本。
- 目标岗位描述，最好放 3 到 5 个相近岗位。
- 项目说明，包括背景、目标、技术栈、负责内容、难点、结果。
- 成果草稿，比如节省时间、提升效率、减少错误、完成交付、自动化流程。
- 技能清单，包括工具、框架、行业经验和可证明的作品。

第一轮先让 NotebookLM 提取岗位画像：

```text
请只基于岗位描述，整理一份岗位能力画像。按“硬性要求、加分项、业务关键词、工具或技术、隐含期待”分组。每一项后面标注来自哪份来源。
```

第二轮做简历匹配：

```text
请比较我的简历和岗位能力画像，输出三列：已经明确覆盖、可能覆盖但表达不足、缺少证据。不要虚构经历，只指出可以从现有来源中强化的内容。
```

第三轮改写项目经历。这里要特别注意：NotebookLM 可以帮你表达，但不能替你编造结果。好的提示词应该限制它只能使用来源中的事实。

```text
请基于项目说明和简历原文，改写 3 条适合简历使用的项目经历。每条都用“动作 + 方法 + 结果”的结构。结果只能使用来源中已经出现的事实；如果缺少量化结果，请用【需要补充证据】标出来。
```

第四轮检查关键词和可读性：

```text
请根据岗位描述检查这份简历可能缺少的关键词。只列出与我真实经历有关、可以自然加入的关键词；不要建议加入我没有证据支持的技能。
```

第五轮准备面试：

```text
请基于优化后的简历和岗位描述，生成 12 个面试追问。按“项目细节、技术选择、问题排查、协作沟通、结果验证”分组，并给出每个问题的回答要点。
```

这个流程的核心不是把简历写得更华丽，而是让每一句话都有证据。真正好的简历优化，是让招聘方更快看见你和岗位的连接。

## vibe coding 学习工作流

vibe coding 可以理解为借助 AI 快速进入开发状态：一边描述目标，一边让 AI 辅助生成、解释、修改和排查代码。它的优势是启动快，风险是容易只会跟着结果走，不知道为什么可行。

NotebookLM 在这里的角色不是替你写代码，而是帮你把散乱学习材料变成可复盘的知识系统。

建议放入这些来源：

- 框架官方文档和关键页面。
- 项目 README、目录结构说明和实现笔记。
- 教程链接或视频资料。
- 报错信息、终端日志和解决过程。
- 自己每次让 AI 修改代码后的判断记录。

第一步，让它建立概念地图：

```text
请基于当前来源，为这个项目整理一张学习地图。按“必须先理解、边做边学、遇到问题再查”三层分类，并解释每个概念在项目中的作用。
```

第二步，拆解报错和调试记录：

```text
请阅读这些错误日志和解决记录，整理出“错误现象、直接原因、根本原因、排查步骤、以后如何避免”。如果来源里没有根本原因，请明确写“来源不足，无法判断”。
```

第三步，把 AI 生成的代码变成自己的知识：

```text
请基于项目笔记，列出这次 AI 辅助编码中我实际学到的 10 个知识点。每个知识点都要说明：它解决了什么问题、对应的源码或文档来源、我下一次如何独立验证。
```

第四步，做项目复盘：

```text
请把这些项目资料整理成一份复盘，结构为：目标、最终实现、关键决策、踩坑记录、仍不理解的点、下一次要改进的开发流程。
```

这样使用 NotebookLM，vibe coding 就不是“靠感觉让 AI 写完”，而是变成“快速实验 + 及时复盘 + 建立判断力”。代码能跑只是第一步，能解释为什么这样写，才算真正学到。

## AI Agent 学习工作流

AI Agent（智能体）学习最容易乱，因为它同时涉及模型、工具调用、工作流、记忆、检索增强、权限、安全、评估和部署。只看碎片文章，很容易觉得每个框架都差不多；真正开始做，又会发现细节完全不同。

我会把智能体学习 notebook 拆成四组来源：

- 概念资料：什么是工具调用、规划、反思、记忆、检索增强和多步骤工作流。
- 框架文档：选择 1 到 2 个主框架，不要一开始横跨太多生态。
- 示例项目：能运行的最小示例、工具定义、状态管理和日志。
- 评估资料：如何判断智能体是否真的完成任务，而不是只生成看似合理的回答。

先建立术语表：

```text
请基于当前来源整理 AI Agent 学习术语表。每个术语包含：一句话解释、它解决的问题、常见误解、来源引用。
```

再比较架构：

```text
请比较这些资料中的智能体架构。按“输入、工具、状态或记忆、执行循环、错误处理、评估方式”分列。不要评价没有来源支持的框架能力。
```

然后生成最小实验清单：

```text
请设计 5 个从简单到复杂的智能体学习实验。每个实验都包含：目标、需要的来源、要实现的功能、成功标准、可能失败的地方。
```

最后用抽认卡或测验巩固：

```text
请基于术语表和实验清单生成 20 张学习卡片。问题要考察理解，不要只考定义。答案需要指出对应来源。
```

学习智能体时，NotebookLM 的价值在于帮你防止“概念漂移”。每次看到新框架、新名词、新演示，都可以问：它到底解决了哪一层问题？和我已经学过的工具调用、工作流、记忆、检索增强有什么关系？

## 高质量提问模板

下面这些模板可以直接复制使用。

### 简历与岗位匹配

```text
请只基于我上传的简历和岗位描述，输出一份匹配分析。分为：高度匹配、表达不足、缺少证据、不建议强调。每一项都要引用来源，不要编造经历。
```

### 项目经历改写

```text
请把这个项目经历改写成适合简历的一段描述和 3 条 bullet。要求突出问题、行动、方法和结果。没有来源支持的量化结果必须用【需要补充】标注。
```

### 编程概念解释

```text
请用项目中的真实文件或文档来源解释这个概念。先给一句话解释，再说明它在本项目中解决什么问题，最后给一个我可以自己验证的小实验。
```

### 调试记录归纳

```text
请把这些报错和解决过程整理成调试复盘。结构为：现象、错误假设、实际原因、验证方法、最终修复、下次排查顺序。
```

### 智能体框架比较

```text
请基于来源比较这些智能体框架或方案。只比较来源中明确提到的内容，按工具调用、状态管理、记忆、工作流、评估和部署复杂度分组。
```

### 周学习计划

```text
请基于当前来源制定 7 天学习计划。每天包含阅读资料、动手任务、输出物和自测问题。计划要优先服务我的目标，不要平均覆盖所有资料。
```

## 限制与注意事项

第一，NotebookLM 的回答即使带引用，也需要人工核对。引用能帮助你回到来源，但不等于结论一定正确。

第二，不要无必要上传敏感个人资料。简历里如果包含手机号、住址、证件号、公司内部信息，先脱敏再使用。

第三，简历优化不能虚构。可以改写表达、重组结构、补充证据，但不能把没有做过的事写成做过。

第四，学习路线不是能力证明。NotebookLM 能帮你安排学习顺序，但真正掌握仍然要靠运行项目、解释错误、复现结果和独立输出。

第五，定期拆分 notebook。一个主题越来越大时，宁可拆成多个清晰空间，也不要让一个 notebook 承担所有事情。

## 我的推荐用法

我最推荐的循环是：

1. 收集资料：把简历、岗位、文档、教程、日志和笔记放进对应 notebook。
2. 提窄问题：不要问“怎么学 AI”，而是问“基于这些来源，我下一步要补哪三个概念”。
3. 生成结构：用表格、清单、学习卡片、复盘模板把信息变成可执行内容。
4. 真实验证：拿输出去改简历、写代码、跑实验、准备面试。
5. 反馈回流：把验证后的结果整理成笔记，再加回 notebook。

NotebookLM 的价值不在于一次性给出完美答案，而在于帮你把资料、问题、输出和复盘串成一个长期系统。对简历来说，它让经历更有证据；对 vibe coding 来说，它让快速实验不至于变成碎片；对 AI Agent 学习来说，它让复杂概念回到清晰结构。

## 参考资料

- [Learn about NotebookLM](https://support.google.com/notebooklm/answer/16164461)
- [Create a notebook in NotebookLM](https://support.google.com/notebooklm/answer/16206563)
- [Add or discover new sources for your notebook](https://support.google.com/notebooklm/answer/16215270)
- [Generate Audio Overview in NotebookLM](https://support.google.com/notebooklm/answer/16212820)
~~~

- [ ] **Step 2: 运行构建，确认新分类尚未接入时会失败**

Run:

```powershell
npm run build
```

期望结果：失败，错误指向 `category` 的枚举校验，说明 `AI 工具` 还没有加入内容 schema。这个失败是本任务的红灯测试。

## Task 3: 接入 `AI 工具` 分类

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/consts.ts`
- Modify: `src/components/PostCard.astro`
- Modify: `src/pages/categories/index.astro`

- [ ] **Step 1: 更新文章分类 schema**

在 `src/content.config.ts` 中把分类枚举改成：

```ts
category: z.enum(['网络代理', '工程制造', '音频设备', 'AI 工具', '个人日志']),
```

- [ ] **Step 2: 更新集中分类定义**

在 `src/consts.ts` 的 `BLOG_CATEGORIES` 中，把 `AI 工具` 放在 `音频设备` 和 `个人日志` 之间：

```ts
export const BLOG_CATEGORIES = [
	{
		name: '网络代理',
		slug: 'network-proxy',
		description: 'Surge、Quantumult X、代理规则维护与网络调试记录。',
	},
	{
		name: '工程制造',
		slug: 'engineering-manufacturing',
		description: 'Siemens NX/UG、模具工艺、制造现场与工程经验沉淀。',
	},
	{
		name: '音频设备',
		slug: 'audio-gear',
		description: '耳机、播放器、桌面链路和个人听感记录。',
	},
	{
		name: 'AI 工具',
		slug: 'ai-tools',
		description: 'NotebookLM、AI 编程、智能体学习和个人知识工作流。',
	},
	{
		name: '个人日志',
		slug: 'personal-log',
		description: '技术折腾、写作复盘和长期输出计划。',
	},
] as const;
```

- [ ] **Step 3: 更新文章卡片分类映射**

在 `src/components/PostCard.astro` 的 `categoryClassMap` 中加入：

```ts
AI 工具: 'is-ai-tools',
```

最终映射应为：

```ts
const categoryClassMap: Record<string, string> = {
	网络代理: 'is-network-proxy',
	工程制造: 'is-engineering',
	音频设备: 'is-audio',
	AI 工具: 'is-ai-tools',
	个人日志: 'is-personal',
};
```

- [ ] **Step 4: 新增 `AI 工具` 卡片渐变**

在 `src/components/PostCard.astro` 的分类渐变样式中，放在 `.is-audio` 和 `.is-personal` 之间：

```css
.post-card-gradient.is-ai-tools {
	background: linear-gradient(135deg, #047857 0%, #2563eb 52%, #7c3aed 100%);
}
```

- [ ] **Step 5: 更新分类页描述**

在 `src/pages/categories/index.astro` 中把 `BaseHead` 描述改成：

```astro
<BaseHead title="分类" description="Chogori Blog 的技术分类：网络代理、工程制造、音频设备、AI 工具和个人日志。" />
```

- [ ] **Step 6: 运行构建，确认分类接入通过**

Run:

```powershell
npm run build
```

期望结果：构建成功，输出包含生成的 `/categories/ai-tools/` 和 `/blog/notebooklm-career-ai-learning-guide/` 页面。

## Task 4: 开发日志、最终验证和提交

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: 添加开发日志**

Run:

```powershell
npm run devlog:add -- --type content --title "新增 NotebookLM 使用指南" --description "加入 AI 工具分类、中文优先内容规则，以及简历优化、氛围式 AI 编程和智能体学习文章"
```

期望结果：

```text
Added changelog item: 2026-05-13 文档 - 新增 NotebookLM 使用指南
```

- [ ] **Step 2: 查看最新开发日志**

Run:

```powershell
npm run devlog:latest
```

期望结果：最新日期 `2026-05-13` 下出现 `新增 NotebookLM 使用指南`。

- [ ] **Step 3: 最终构建验证**

Run:

```powershell
npm run build
```

期望结果：构建成功，没有内容 schema、分类路由或 Markdown 渲染错误。

- [ ] **Step 4: 检查工作区范围**

Run:

```powershell
git status --short
```

期望只看到这些文件：

```text
 M AGENTS.md
 M src/components/PostCard.astro
 M src/consts.ts
 M src/content.config.ts
 M src/data/devlog.json
 M src/pages/categories/index.astro
?? src/content/blog/notebooklm-career-ai-learning-guide.md
```

- [ ] **Step 5: 提交实现**

Run:

```powershell
git add -- AGENTS.md src/components/PostCard.astro src/consts.ts src/content.config.ts src/data/devlog.json src/pages/categories/index.astro src/content/blog/notebooklm-career-ai-learning-guide.md
git commit -m "content: add notebooklm ai learning guide"
```

期望结果：提交成功，提交内只包含上述文件。

## 自查记录

- 设计覆盖：计划覆盖中文优先规则、`AI 工具` 分类、NotebookLM 文章、开发日志和构建验证。
- 范围控制：不触碰 Cloudflare、Vercel、GitHub OAuth、Decap CMS、旧文章、布局重设计或图片流水线。
- 语言约束：文章正文以中文为主，只保留 NotebookLM、Chat、Studio、URL、文件路径和必要技术词。
- 红灯测试：先添加新分类文章再运行 `npm run build`，预期 schema 失败；分类接入后再次构建应通过。
