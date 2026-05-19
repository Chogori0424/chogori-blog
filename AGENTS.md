# Codex Project Rules

## Development Log

- Every Codex change that adds a feature, fixes a bug, improves styles, changes deployment/build configuration, updates content systems, or refactors project structure must update `src/data/devlog.json` before commit.
- Use `npm run devlog:add -- --type <type> --title "<title>" --description "<description>" --tags "tag-a,tag-b"` when adding a new development log entry.
- Supported devlog types are `feature`, `fix`, `style`, `content`, `deploy`, and `refactor`.

## 内容语言

- 面向读者的站内内容默认使用中文，包括文章标题、摘要、正文、分类描述、按钮文案和页面说明。
- 产品名、技术名词、代码标识、命令、文件路径、URL、官方功能名和必要引用可以保留英文。
- 英文技术词第一次出现在正文时，尽量补充中文解释，例如 `vibe coding（氛围式 AI 编程）`、`AI Agent（智能体）`。
- 不为了显得专业而堆英文；可以自然翻译的概念优先中文化。

## Codex 工作语言

- Codex 与用户沟通时必须默认使用中文。
- Codex 创建或更新设计文档、实施计划、开发日志、变更总结、审查结论和最终回复时必须使用中文。
- 面向项目维护者或读者的说明、按钮文案、页面文案和文档正文默认使用中文。
- 产品名、技术名词、代码标识、命令、文件路径、URL、官方 API 名称、错误原文和必要引用可以保留英文。
- 如果英文技术词会影响理解，首次出现时尽量补充中文解释。
- 除非用户明确要求英文，不要用英文替代可自然中文表达的内容。

## Verification

- Run `npm run build` before every commit.
- Check `git status` before committing so unrelated files are not included.

## Safety

- Do not commit tokens, cookies, `.env`, `.env.*`, `.vercel`, `node_modules`, or `dist`.
- Do not modify Cloudflare, Vercel, GitHub OAuth, or Decap CMS configuration unless the user explicitly asks for it.
- Do not change existing Markdown article content unless the user explicitly asks for a content edit.
