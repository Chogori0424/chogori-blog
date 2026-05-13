# NotebookLM 职业与 AI 学习指南设计

## 目标

在博客中新增一篇中文长文，详细说明如何把 NotebookLM 用作职业成长和 AI 学习工作台，重点覆盖简历制作优化、vibe coding（氛围式 AI 编程）学习、AI Agent（智能体）学习。

文章不能写成泛泛的产品介绍。它应该先讲清 NotebookLM 的核心工作方式，再把这个工作方式落到求职、编程学习和智能体学习三个可复用流程里。

本文件只定义已确认的内容方向和实施边界，不直接修改文章、分类或页面代码。

## 当前项目背景

当前有效项目根目录是 `C:\Users\16354\Documents\chogori-blog`。

相关文件：

- `src/content/blog/*.{md,mdx}` 存放博客文章。
- `src/content.config.ts` 校验文章 frontmatter，目前只允许四个分类。
- `src/consts.ts` 定义 `BLOG_CATEGORIES`、分类 slug 和分类描述，首页、文章列表和分类页都会使用。
- `src/components/PostCard.astro` 根据分类映射文章卡片封面渐变样式。
- `src/pages/categories/index.astro` 的页面描述目前只提到现有分类。
- `src/data/devlog.json` 是开发日志数据源，内容和分类变更需要按项目规则记录。

当前分类是 `网络代理`、`工程制造`、`音频设备`、`个人日志`。用户已确认新增 `AI 工具` 分类，用于这篇文章和后续 AI 工具类内容。

## 语言与写作约束

本项目面向中文阅读环境。后续站内内容非必要不使用英文。

执行规则：

- 正文、标题、摘要、分类描述、站内文案优先使用中文。
- 产品名、技术名词、代码标识、命令、URL、文件路径、官方功能名和必要引用可以保留英文。
- 第一次出现英文技术词时，尽量补充中文解释，例如 `vibe coding（氛围式 AI 编程）`、`AI Agent（智能体）`。
- 不为了显得专业而堆英文词；能自然翻译的概念尽量中文化。
- NotebookLM 文章中的 `Chat`、`Studio`、`Audio Overview`、`Video Overview`、`Mind Map` 等官方界面或功能名可以保留英文，但应配合中文解释。

## 信息来源基础

实施时应参考 Google 官方 NotebookLM 说明，避免基于过期印象写功能。

当前官方资料要点：

- NotebookLM 是围绕用户上传资料工作的 AI 研究助手，可基于来源回答问题，并提供引用。
- NotebookLM 的基本模型是创建 notebook、添加来源，然后通过 Chat 和 Studio 面板工作。
- 官方说明中支持的来源类型包括 PDF、网页、公开 YouTube 链接、音频文件、Google Docs、Google Slides、Microsoft Word、文本、Markdown、图片、Google Sheets 和粘贴文本等。
- Studio 可生成笔记、音频概览、视频概览、思维导图、报告、数据表、抽认卡、测验、幻灯片和信息图等输出。

文章不要把易变化的功能细节写死。涉及具体功能可写成“按当前官方说明”，重点放在更稳定的工作流上。

实施时优先查阅这些官方链接：

- https://support.google.com/notebooklm/answer/16164461
- https://support.google.com/notebooklm/answer/16206563
- https://support.google.com/notebooklm/answer/16215270
- https://support.google.com/notebooklm/answer/16212820

## 已确认方案

采用用户确认的组合方案：实战手册加职业成长框架。

文章应做到：

- 开头讲清 NotebookLM 擅长基于资料阅读、归纳、比较、制定学习计划和生成结构化输出。
- 强调核心用法：一个 notebook 只服务一个清晰任务边界，资料质量决定输出质量。
- 把简历优化放在第一个重点场景，因为它最具体、价值最高。
- 把 vibe coding 写成一种学习和实验流程，不宣称 AI 可以替代工程基本功。
- 把 AI Agent 学习写成结构化研究路径：概念、框架、工具调用、检索增强、记忆、评估和实验。
- 提供可直接复制的中文提示词模板。
- 明确限制和安全边界：不要无必要上传敏感隐私，不虚构简历经历，重要结论要核对引用，NotebookLM 是学习辅助，不替代真实项目经验。

## 文章设计

新增文章：

- 文件：`src/content/blog/notebooklm-career-ai-learning-guide.md`
- 标题：`NotebookLM 使用说明：从简历优化到 vibe coding 与 AI Agent 学习`
- 分类：`AI 工具`
- 标签：`NotebookLM`、`AI 工具`、`简历优化`、`Vibe Coding`、`AI Agent`、`学习方法`
- 发布日期：`2026-05-13`
- 头图：复用现有博客占位图，不新增图片资产。

目标长度约 4,500 到 6,500 个中文字符。文章要足够详细，包含流程和提示词，但避免产品宣传式堆砌。

建议文章结构：

1. `NotebookLM 适合解决什么问题`
   - 说明基于资料的 notebook 工作方式和普通开放式聊天的差异。
   - 定义高质量资料来源：简历、岗位描述、项目笔记、教程、文档、论文、视频和错误日志。

2. `基础使用流程`
   - 创建 notebook。
   - 添加来源。
   - 用 Chat 提问并查看引用。
   - 在有需要时用 Studio 生成简报、学习指南、思维导图、音频或视频概览、数据表、抽认卡、测验、幻灯片或信息图。

3. `一个 notebook 一个任务边界`
   - 建议为简历优化、目标岗位、作品集项目、vibe coding 学习和 AI Agent 学习分别建立 notebook。
   - 解释混合太多主题会降低检索精度和回答稳定性。

4. `简历制作与优化工作流`
   - 输入资料：现有简历、目标岗位描述、项目说明、技能清单、成果草稿。
   - 步骤：提取岗位要求、比较简历与岗位匹配度、改写项目 bullet、量化成果、检查 ATS 关键词、准备面试问答。
   - 提供岗位匹配、项目经历改写、证据缺口检查、面试准备等提示词模板。

5. `vibe coding 学习工作流`
   - 输入资料：框架文档、教程链接、README、问题记录、错误日志、个人项目笔记。
   - 步骤：建立概念图、追问错误原因、把调试记录沉淀成规则、生成项目复盘。
   - 保持克制表达：AI 可以加速探索，但学习者仍然要运行代码、检查失败、记录决策。

6. `AI Agent 学习工作流`
   - 输入资料：智能体框架文档、工具调用示例、检索增强资料、工作流图、评估文章、记忆设计笔记。
   - 步骤：建立术语表、比较架构、列出最小实验、生成抽认卡或测验、制定学习路线。
   - 提供框架比较、实验规划、概念解释等提示词。

7. `高质量提问模板`
   - 按场景提供提示词：
     - 简历与岗位匹配。
     - 项目经历改写。
     - 编程概念解释。
     - 调试记录归纳。
     - 智能体框架比较。
     - 周学习计划。

8. `限制与注意事项`
   - 有引用也要核对重要事实。
   - 不上传不必要的敏感个人资料。
   - 不虚构简历成果。
   - 不把生成的学习路线当作已经掌握的证明。
   - 定期清理资料库，主题过大时拆分 notebook。

9. `我的推荐用法`
   - 用一个循环收束：收集资料、提出窄问题、生成结构化输出、在真实工作中验证，再把笔记反馈回 notebook。

## 分类设计

新增 `AI 工具` 分类，并同步所有分类系统：

- 在 `src/content.config.ts` 的文章 frontmatter 枚举中加入 `AI 工具`。
- 在 `src/consts.ts` 的 `BLOG_CATEGORIES` 中加入：
  - `name`: `AI 工具`
  - `slug`: `ai-tools`
  - `description`: `NotebookLM、AI 编程、智能体学习和个人知识工作流。`
- 在 `src/components/PostCard.astro` 中加入 `AI 工具` 的分类样式映射，避免落入默认渐变。
- 更新 `src/pages/categories/index.astro` 的页面描述，把新分类纳入说明。

分类导航由 `BLOG_CATEGORIES` 自动生成，不需要重构导航。

## 文件范围

计划修改：

- `src/content/blog/notebooklm-career-ai-learning-guide.md`
- `src/content.config.ts`
- `src/consts.ts`
- `src/components/PostCard.astro`
- `src/pages/categories/index.astro`
- `src/data/devlog.json`

实施计划中还应评估是否把“中文优先写作约束”固化到 `AGENTS.md`。如果执行该变更，需要同步记录开发日志。

不做：

- 不改 Cloudflare、Vercel、GitHub OAuth 或 Decap CMS 配置。
- 不做布局重设计。
- 不修改无关旧文章内容。
- 不生成新图片，不改图片流水线。

## 验证

实施验证应包括：

- 使用 `npm run devlog:add` 记录内容和分类新增。
- 使用 `npm run devlog:latest` 确认最新开发日志。
- 使用 `npm run build` 验证 Astro 内容 schema、分类路由、RSS 和 Markdown 渲染。
- 提交前使用 `git status --short` 检查只包含预期文件。

## 成功标准

- 新文章构建通过，并可通过 `/blog/notebooklm-career-ai-learning-guide/` 访问。
- `AI 工具` 分类出现在分类导航和分类页面中，路由为 `/categories/ai-tools/`。
- 文章针对简历优化、vibe coding 学习和 AI Agent 学习给出具体 NotebookLM 工作流。
- 文章包含实用提示词模板和负责任使用提醒。
- 正文整体面向中文读者，除必要产品名、技术名词、命令、路径和链接外，不夹杂无必要英文。
- 开发日志记录本次内容新增。
