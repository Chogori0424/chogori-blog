# 跨项目 Codex 中文规则实施计划

> **给自动化执行者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务执行本计划。步骤使用复选框（`- [ ]`）标记进度。

**目标：** 为本机已发现项目的 `AGENTS.md` 增加统一的 Codex 中文工作语言规则。

**架构：** 只更新现有项目说明文件，不改业务代码。每个项目保留原有约束，并追加同一段中文规则，用来约束 Codex 沟通、设计文档、实施计划、开发日志、总结和审查输出。

**技术栈：** Markdown、Git、PowerShell。

---

## 文件结构

- 修改：`C:\Users\16354\Documents\chogori-blog\AGENTS.md`
  - 在现有 `内容语言` 后增加更严格的 `Codex 工作语言` 规则。
  - 保留博客项目已有的读者内容语言规则。
- 修改：`C:\Users\16354\Documents\KeyHint\AGENTS.md`
  - 在 `Expected Workflow` 后增加同一段 `Codex 工作语言` 规则。
  - 保留 KeyHint 现有技术栈和工作流约束。
- 修改：`C:\Users\16354\Documents\chogori-blog\src\data\devlog.json`
  - 通过 `npm run devlog:add` 增加一条开发日志，因为博客项目规则要求工作流和样式类变更同步记录开发日志。

## 任务 1：更新博客项目的 Agent 语言规则

**文件：**
- 修改：`C:\Users\16354\Documents\chogori-blog\AGENTS.md`

- [ ] **步骤 1：插入共享语言规则**

在博客现有 `内容语言` 段落后增加：

```md
## Codex 工作语言

- Codex 与用户沟通时必须默认使用中文。
- Codex 创建或更新设计文档、实施计划、开发日志、变更总结、审查结论和最终回复时必须使用中文。
- 面向项目维护者或读者的说明、按钮文案、页面文案和文档正文默认使用中文。
- 产品名、技术名词、代码标识、命令、文件路径、URL、官方 API 名称、错误原文和必要引用可以保留英文。
- 如果英文技术词会影响理解，首次出现时尽量补充中文解释。
- 除非用户明确要求英文，不要用英文替代可自然中文表达的内容。
```

- [ ] **步骤 2：确认标题只出现一次**

运行：

```powershell
Select-String -Path 'C:\Users\16354\Documents\chogori-blog\AGENTS.md' -Pattern 'Codex 工作语言'
```

预期：只返回一个匹配标题。

## 任务 2：更新 KeyHint 项目的 Agent 语言规则

**文件：**
- 修改：`C:\Users\16354\Documents\KeyHint\AGENTS.md`

- [ ] **步骤 1：插入共享语言规则**

在 `Expected Workflow` 后增加：

```md
## Codex 工作语言

- Codex 与用户沟通时必须默认使用中文。
- Codex 创建或更新设计文档、实施计划、开发日志、变更总结、审查结论和最终回复时必须使用中文。
- 面向项目维护者或读者的说明、按钮文案、页面文案和文档正文默认使用中文。
- 产品名、技术名词、代码标识、命令、文件路径、URL、官方 API 名称、错误原文和必要引用可以保留英文。
- 如果英文技术词会影响理解，首次出现时尽量补充中文解释。
- 除非用户明确要求英文，不要用英文替代可自然中文表达的内容。
```

- [ ] **步骤 2：确认标题只出现一次**

运行：

```powershell
Select-String -Path 'C:\Users\16354\Documents\KeyHint\AGENTS.md' -Pattern 'Codex 工作语言'
```

预期：只返回一个匹配标题。

## 任务 3：增加博客开发日志

**文件：**
- 修改：`C:\Users\16354\Documents\chogori-blog\src\data\devlog.json`

- [ ] **步骤 1：使用项目命令增加开发日志**

运行：

```powershell
npm run devlog:add -- --type style --title "统一 Codex 中文工作语言规则" --description "在项目 AGENTS.md 中明确 Codex 沟通、设计文档、实施计划、开发日志、总结和审查结论默认全部使用中文。" --tags "workflow,agents,language"
```

预期：命令提示已经新增开发日志条目。

- [ ] **步骤 2：确认最新开发日志包含该条目**

运行：

```powershell
npm run devlog:latest
```

预期：输出包含 `统一 Codex 中文工作语言规则`。

## 任务 4：验证

**文件：**
- 读取：`C:\Users\16354\Documents\chogori-blog\AGENTS.md`
- 读取：`C:\Users\16354\Documents\KeyHint\AGENTS.md`
- 读取：`C:\Users\16354\Documents\chogori-blog\src\data\devlog.json`

- [ ] **步骤 1：检查修改范围**

运行：

```powershell
git -C 'C:\Users\16354\Documents\chogori-blog' diff -- AGENTS.md docs/superpowers/plans/2026-05-19-cross-project-chinese-agent-rules.md src/data/devlog.json
git -C 'C:\Users\16354\Documents\KeyHint' diff -- AGENTS.md
```

预期：差异只包含新计划、共享中文规则和博客开发日志。KeyHint 当前文件整体未跟踪时，`git diff` 可能为空，需要用文件内容读取结果确认。

- [ ] **步骤 2：构建博客项目**

运行：

```powershell
npm run build
```

预期：Astro 构建成功。

- [ ] **步骤 3：检查仓库状态**

运行：

```powershell
git -C 'C:\Users\16354\Documents\chogori-blog' status --short
git -C 'C:\Users\16354\Documents\KeyHint' status --short
```

预期：博客状态只列出本次计划内文件；KeyHint 状态会继续显示执行前已经存在的未跟踪项目文件，其中包含本次更新过的 `AGENTS.md`。

## 自查

- 需求覆盖：两个已发现本地项目的 `AGENTS.md` 都有对应任务，博客开发日志要求也有对应任务。
- 占位符扫描：没有 `TBD`、`TODO` 或未说明的实现步骤。
- 范围检查：计划只覆盖项目说明文件和必要的博客开发日志。
