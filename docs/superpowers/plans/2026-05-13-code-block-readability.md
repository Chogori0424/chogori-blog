# 文章代码块可读性 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让文章代码块和提示词块默认隐藏复制按钮，并让长文本自动换行，避免读者横向拖动阅读。

**Architecture:** 改动集中在现有 `CodeCopy.astro` 增强组件，统一控制所有 `pre > code` 的复制按钮和换行行为。同步调整 `BlogPost.astro` 中更高优先级的文章 `pre` 样式，避免布局层继续强制横向滚动。

**Tech Stack:** Astro 6、组件内全局 CSS、Markdown 代码块、现有 `devlog:add` 工作流、`npm run build`。

---

## 文件结构

- 修改 `src/components/CodeCopy.astro`：控制复制按钮显隐、代码块换行、长字符断行。
- 修改 `src/layouts/BlogPost.astro`：把文章正文 `pre` 的横向滚动默认行为改为隐藏横向溢出，并补充换行兜底。
- 修改 `src/data/devlog.json`：通过 `npm run devlog:add` 记录样式优化。

## Task 1: 更新代码块组件样式

**Files:**
- Modify: `src/components/CodeCopy.astro`

- [ ] **Step 1: 替换 `CodeCopy.astro` 的全局样式块**

将 `src/components/CodeCopy.astro` 中 `<style is:global>` 内的内容替换为下面完整样式。脚本逻辑不变。

```astro
<style is:global>
	.code-block-wrapper {
		position: relative;
	}

	.code-block-wrapper pre {
		overflow-x: hidden;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
		padding-right: 5.5rem;
	}

	.code-block-wrapper pre > code {
		display: block;
		overflow-wrap: inherit;
		white-space: inherit;
		word-break: inherit;
	}

	.code-copy-button {
		position: absolute;
		top: 0.65rem;
		right: 0.65rem;
		z-index: 1;
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-pill);
		padding: 0.2rem 0.55rem;
		background: var(--surface-soft);
		color: var(--color-text);
		font: inherit;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1.4;
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		backdrop-filter: blur(10px);
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.code-block-wrapper:hover .code-copy-button,
	.code-block-wrapper:focus-within .code-copy-button,
	.code-copy-button:focus-visible {
		opacity: 1;
		pointer-events: auto;
	}

	.code-copy-button:hover,
	.code-copy-button:focus-visible {
		border-color: var(--color-accent-hover);
		background: var(--color-bg-hover);
		color: var(--color-text);
	}
</style>
```

- [ ] **Step 2: 检查组件样式关键规则**

Run:

```powershell
rg -n "overflow-x: hidden|white-space: pre-wrap|overflow-wrap: anywhere|opacity: 0|pointer-events: none|focus-within" src\components\CodeCopy.astro
```

Expected: 输出至少包含 `overflow-x: hidden`、`white-space: pre-wrap`、`overflow-wrap: anywhere`、`opacity: 0`、`pointer-events: none` 和 `focus-within`。

## Task 2: 同步文章布局层的 `pre` 样式

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: 更新文章正文 `pre` 样式**

在 `src/layouts/BlogPost.astro` 中，把当前：

```css
:global(.post-article .prose pre) {
	max-width: 100%;
	margin: 1.5rem 0 1.8rem;
	overflow-x: auto;
	font-size: 0.9rem;
	line-height: 1.7;
}
```

替换为：

```css
:global(.post-article .prose pre) {
	max-width: 100%;
	margin: 1.5rem 0 1.8rem;
	overflow-x: hidden;
	overflow-wrap: anywhere;
	font-size: 0.9rem;
	line-height: 1.7;
	white-space: pre-wrap;
}
```

- [ ] **Step 2: 添加文章正文 `pre > code` 继承规则**

在 `src/layouts/BlogPost.astro` 中，把当前：

```css
:global(.post-article .prose :not(pre) > code) {
	font-size: 0.92em;
}
```

替换为：

```css
:global(.post-article .prose pre > code) {
	display: block;
	overflow-wrap: inherit;
	white-space: inherit;
}
:global(.post-article .prose :not(pre) > code) {
	font-size: 0.92em;
}
```

- [ ] **Step 3: 检查布局层关键规则**

Run:

```powershell
rg -n "post-article.*pre|overflow-x: hidden|white-space: pre-wrap|pre > code|overflow-wrap: inherit" src\layouts\BlogPost.astro
```

Expected: 输出包含文章 `pre` 的 `overflow-x: hidden`、`white-space: pre-wrap`，以及 `pre > code` 的继承规则。

## Task 3: 构建与源代码验证

**Files:**
- No source changes

- [ ] **Step 1: 运行构建**

Run:

```powershell
npm run build
```

Expected: 构建成功，输出包含 `Complete!`，并继续生成 `/blog/notebooklm-career-ai-learning-guide/index.html`。

- [ ] **Step 2: 用源码规则确认默认隐藏复制按钮**

Run:

```powershell
rg -n "opacity: 0|pointer-events: none|code-block-wrapper:hover .code-copy-button|code-block-wrapper:focus-within .code-copy-button|code-copy-button:focus-visible" src\components\CodeCopy.astro
```

Expected: 输出显示按钮默认 `opacity: 0`、`pointer-events: none`，并有 hover、focus-within、focus-visible 显示规则。

- [ ] **Step 3: 用源码规则确认长文本换行**

Run:

```powershell
rg -n "white-space: pre-wrap|overflow-wrap: anywhere|overflow-x: hidden" src\components\CodeCopy.astro src\layouts\BlogPost.astro
```

Expected: 两个文件都包含换行或隐藏横向溢出的相关规则。

## Task 4: 本地页面视觉验证

**Files:**
- No source changes

- [ ] **Step 1: 启动本地开发服务器**

Run:

```powershell
$log = Join-Path $env:TEMP "chogori-blog-dev.log"
$process = Start-Process -FilePath "powershell" -ArgumentList @("-NoProfile", "-Command", "Set-Location 'C:\Users\16354\Documents\chogori-blog'; npm run dev -- --host 127.0.0.1 --port 4321 *> '$log'") -WindowStyle Hidden -PassThru
$process.Id
```

Expected: 输出一个进程 ID。

- [ ] **Step 2: 确认本地文章页面可访问**

Run:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:4321/blog/notebooklm-career-ai-learning-guide/" -UseBasicParsing -TimeoutSec 30 | Select-Object StatusCode
```

Expected: `StatusCode` 为 `200`。

- [ ] **Step 3: 在浏览器中检查 NotebookLM 文章**

Open:

```text
http://127.0.0.1:4321/blog/notebooklm-career-ai-learning-guide/
```

Expected:

- 页面里的长提示词代码块自动换行。
- 代码块默认不显示 `复制` 按钮。
- 鼠标移入代码块时显示 `复制` 按钮。
- 点击按钮后显示 `已复制`，随后恢复 `复制`。
- 页面不需要横向拖动才能读完提示词。

- [ ] **Step 4: 在浏览器中检查已有 Surge 文章**

Open:

```text
http://127.0.0.1:4321/blog/ios-update-cellular-apple-cdn-surge/
```

Expected:

- Surge 规则代码块不撑破文章容器。
- 复制按钮默认隐藏，鼠标移入代码块后出现。
- 长规则行可以在代码块内换行。

- [ ] **Step 5: 停止本地开发服务器**

Run:

```powershell
Stop-Process -Id $process.Id
```

Expected: 本地开发服务器进程停止。

## Task 5: 开发日志与提交

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: 添加开发日志**

Run:

```powershell
npm run devlog:add -- --type style --title "优化文章代码块阅读体验" --description "复制按钮默认隐藏，仅在悬停或焦点进入时显示，并让长提示词和长文本在代码块内自动换行"
```

Expected:

```text
Added changelog item: 2026-05-13 样式 - 优化文章代码块阅读体验
```

- [ ] **Step 2: 查看最新开发日志**

Run:

```powershell
npm run devlog:latest
```

Expected: 最新日期 `2026-05-13` 下出现 `优化文章代码块阅读体验`。

- [ ] **Step 3: 最终构建验证**

Run:

```powershell
npm run build
```

Expected: 构建成功，输出包含 `Complete!`。

- [ ] **Step 4: 检查工作区范围**

Run:

```powershell
git status --short
```

Expected:

```text
 M src/components/CodeCopy.astro
 M src/data/devlog.json
 M src/layouts/BlogPost.astro
```

- [ ] **Step 5: 提交实现**

Run:

```powershell
git add -- src/components/CodeCopy.astro src/layouts/BlogPost.astro src/data/devlog.json
git commit -m "style: improve code block readability"
```

Expected: 提交成功，提交内只包含上述三个文件。

## 自查记录

- 设计覆盖：计划覆盖复制按钮默认隐藏、hover 和 focus 显示、长文本换行、现有复制功能保留、构建验证、视觉验证和开发日志。
- 范围控制：不修改文章正文，不新增提示词组件，不碰部署或外部平台配置。
- 选择器一致性：组件层和文章布局层都显式设置 `overflow-x: hidden` 与换行规则，避免 `BlogPost.astro` 的更高优先级选择器继续保留横向滚动。
- 可访问性：计划保留按钮与 `aria-label`，通过 `:focus-within` 和 `:focus-visible` 支持键盘焦点。
