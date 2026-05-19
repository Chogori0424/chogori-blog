# 公开分身聊天界面优化实施计划

> **给自动化执行者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务执行本计划。步骤使用复选框（`- [ ]`）标记进度。

**目标：** 将 `/bot` 公开分身页面优化为左右气泡聊天界面，并增加 `Enter` 发送、`Shift+Enter` 换行、中文输入法组词期间不误发送的键盘交互。

**架构：** 保持现有 Astro 单页实现和 `/api/bot/public` API 不变，只在 `src/pages/bot.astro` 更新前端结构、样式和浏览器脚本。消息渲染继续使用 `textContent`，避免 HTML 注入；开发日志通过项目命令追加。

**技术栈：** Astro 6、内联 CSS、原生浏览器 JavaScript、Node 内置测试、Astro build。

---

## 文件结构

- 修改：`src/pages/bot.astro`
  - 职责：公开分身页面的聊天布局、消息 DOM、输入区、键盘发送逻辑和本地错误展示。
  - 不改变请求地址、请求体结构或 API 返回处理边界。
- 修改：`src/data/devlog.json`
  - 职责：记录本次 UI 和交互优化。
  - 必须使用 `npm run devlog:add` 修改，不手写 JSON。
- 创建或保留：`docs/superpowers/plans/2026-05-20-bot-chat-ui.md`
  - 职责：本实施计划。

不修改：

- `api/bot/public.js`
- `src/lib/bot/publicProfile.js`
- `tests/bot-public-profile.test.mjs`
- Vercel、Cloudflare、Decap CMS、GitHub OAuth、私有记忆或本人模式相关配置
- 现有 Markdown 文章内容

## 当前工作区边界

执行前已存在这些非本任务改动：

```text
 M AGENTS.md
 M src/data/devlog.json
?? .superpowers/
?? docs/superpowers/plans/2026-05-19-cross-project-chinese-agent-rules.md
```

这些文件里，`AGENTS.md`、`.superpowers/`、`docs/superpowers/plans/2026-05-19-cross-project-chinese-agent-rules.md` 不属于本次 UI 任务，不要修改或暂存。

`src/data/devlog.json` 已有一条与“统一 Codex 中文工作语言规则”相关的未提交 devlog。执行本计划时会继续用 `npm run devlog:add` 追加本次 UI 记录。提交前必须检查 diff，避免在用户未确认的情况下把无关 devlog 改动混入同一个提交。

## 任务 1：重构聊天消息结构和样式

**文件：**
- 修改：`src/pages/bot.astro`

- [ ] **步骤 1：替换消息区和输入区 CSS**

在 `src/pages/bot.astro` 的 `<style>` 中，保留 `main`、`.bot-shell`、`.bot-toolbar`、`.bot-title`、`.mode-tabs` 相关规则；从 `.chat-panel` 开始到 `@media (max-width: 640px)` 结束，替换为下面代码：

```css
			.chat-panel {
				display: grid;
				grid-template-rows: minmax(320px, 1fr) auto;
				overflow: hidden;
				border: 1px solid var(--color-card-border);
				border-radius: var(--radius-card);
				background: var(--surface-soft);
				box-shadow: 0 18px 40px rgba(var(--black), 8%);
			}
			.messages {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				overflow-y: auto;
				padding: 1.1rem;
			}
			.message-row {
				display: flex;
				align-items: flex-end;
				gap: 0.65rem;
				max-width: min(780px, 92%);
			}
			.message-row[data-role='assistant'] {
				align-self: flex-start;
			}
			.message-row[data-role='user'] {
				align-self: flex-end;
				flex-direction: row-reverse;
			}
			.message-avatar {
				display: grid;
				flex: 0 0 2rem;
				width: 2rem;
				height: 2rem;
				place-items: center;
				border: 1px solid var(--color-card-border);
				border-radius: 0.75rem;
				background: var(--surface);
				color: var(--color-link);
				font-size: 0.86rem;
				font-weight: 900;
				line-height: 1;
			}
			.message-row[data-role='user'] .message-avatar {
				border-color: var(--color-accent);
				border-radius: var(--radius-pill);
				background: var(--color-accent);
				color: var(--color-bg);
			}
			.message-content {
				display: grid;
				gap: 0.35rem;
				min-width: 0;
			}
			.message-row[data-role='user'] .message-content {
				justify-items: end;
			}
			.message-meta {
				color: var(--color-text-muted);
				font-size: 0.78rem;
				font-weight: 800;
				line-height: 1;
			}
			.message-bubble {
				max-width: 100%;
				border: 1px solid var(--color-card-border);
				border-radius: 1.05rem 1.05rem 1.05rem 0.35rem;
				padding: 0.82rem 0.95rem;
				background: var(--surface);
				color: var(--color-text);
				white-space: pre-wrap;
				overflow-wrap: anywhere;
				line-height: 1.65;
			}
			.message-row[data-role='user'] .message-bubble {
				border-color: var(--color-accent);
				border-radius: 1.05rem 1.05rem 0.35rem 1.05rem;
				background: var(--color-accent);
				color: var(--color-bg);
				font-weight: 800;
			}
			.composer {
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto;
				gap: 0.75rem;
				align-items: end;
				border-top: 1px solid var(--color-card-border);
				padding: 1rem;
				background: var(--surface);
			}
			.composer textarea {
				min-height: 3.35rem;
				max-height: 10rem;
				resize: vertical;
				border: 1px solid var(--color-card-border);
				border-radius: var(--radius-container);
				padding: 0.78rem 0.9rem;
				background: var(--color-bg);
				color: var(--color-text);
				font: inherit;
				line-height: 1.5;
			}
			.composer textarea:focus {
				outline: 2px solid var(--color-accent);
				outline-offset: 2px;
			}
			.composer-actions {
				display: grid;
				gap: 0.45rem;
				justify-items: end;
			}
			.composer button {
				border: 1px solid var(--color-accent);
				border-radius: var(--radius-pill);
				padding: 0.85rem 1.1rem;
				background: var(--color-accent);
				color: var(--color-bg);
				font: inherit;
				font-weight: 900;
				line-height: 1;
			}
			.composer button:disabled {
				cursor: wait;
				opacity: 0.65;
			}
			.composer-hint {
				margin: 0;
				color: var(--color-text-muted);
				font-size: 0.78rem;
				line-height: 1.2;
				text-align: right;
			}
			.status-line {
				min-height: 1.2rem;
				margin: 0;
				color: var(--color-text-muted);
				font-size: 0.86rem;
				text-align: right;
			}
			.status-line[data-state='error'] {
				color: #b91c1c;
			}
			@media (max-width: 640px) {
				main {
					max-width: calc(100% - 1rem);
				}
				.bot-title h1 {
					font-size: 1.65rem;
				}
				.chat-panel {
					grid-template-rows: minmax(360px, 1fr) auto;
					border-radius: var(--radius-container);
				}
				.messages {
					padding: 0.85rem;
				}
				.message-row {
					max-width: 96%;
					gap: 0.5rem;
				}
				.message-avatar {
					flex-basis: 1.8rem;
					width: 1.8rem;
					height: 1.8rem;
					font-size: 0.78rem;
				}
				.message-bubble {
					padding: 0.74rem 0.82rem;
				}
				.composer {
					grid-template-columns: 1fr;
					padding: 0.85rem;
				}
				.composer-actions {
					justify-items: stretch;
				}
				.composer button {
					width: 100%;
				}
				.composer-hint,
				.status-line {
					text-align: left;
				}
			}
```

预期：样式仍只依赖现有 CSS 变量，不引入新全局样式文件。

- [ ] **步骤 2：替换初始消息和输入区 HTML**

在 `src/pages/bot.astro` 中，将当前 `<div id="messages" class="messages" aria-live="polite">` 和 `<form id="composer" class="composer">` 内部结构替换为：

```astro
					<div id="messages" class="messages" aria-live="polite">
						<div class="message-row" data-role="assistant">
							<div class="message-avatar" aria-hidden="true">分</div>
							<div class="message-content">
								<div class="message-meta">公开分身</div>
								<div class="message-bubble">直接问就行。</div>
							</div>
						</div>
					</div>
					<form id="composer" class="composer">
						<textarea
							id="message-input"
							name="message"
							maxlength="2000"
							placeholder="输入一句想让分身回应的话"
							autocomplete="off"
							required
						></textarea>
						<div class="composer-actions">
							<button id="send-button" type="submit">发送</button>
							<p class="composer-hint">Enter 发送 · Shift+Enter 换行</p>
							<p id="status-line" class="status-line" aria-live="polite"></p>
						</div>
					</form>
```

预期：初始消息已经有 `公开分身` 标签和 `分` 标记；输入区显示快捷键提示。

- [ ] **步骤 3：构建一次确认 Astro 语法有效**

运行：

```powershell
npm run build
```

预期：构建成功，并生成 `/bot/index.html`。

## 任务 2：增加动态消息 DOM 和 Enter 发送逻辑

**文件：**
- 修改：`src/pages/bot.astro`

- [ ] **步骤 1：替换脚本中的状态和消息创建函数**

在 `<script>` 中，保留现有 DOM 查询常量，并在 `const statusLine = ...` 后增加 IME 状态；然后将 `setStatus` 和 `appendMessage` 函数替换为：

```js
			let isComposing = false;

			const roleMeta = {
				assistant: {
					label: '公开分身',
					avatar: '分',
				},
				user: {
					label: '你',
					avatar: '你',
				},
			};

			function setStatus(text, state = '') {
				statusLine.textContent = text;
				statusLine.dataset.state = state;
			}

			function appendMessage(role, text) {
				const meta = roleMeta[role] || roleMeta.assistant;
				const row = document.createElement('div');
				row.className = 'message-row';
				row.dataset.role = role;

				const avatar = document.createElement('div');
				avatar.className = 'message-avatar';
				avatar.setAttribute('aria-hidden', 'true');
				avatar.textContent = meta.avatar;

				const content = document.createElement('div');
				content.className = 'message-content';

				const label = document.createElement('div');
				label.className = 'message-meta';
				label.textContent = meta.label;

				const bubble = document.createElement('div');
				bubble.className = 'message-bubble';
				bubble.textContent = text;

				content.append(label, bubble);
				row.append(avatar, content);
				messages.append(row);
				messages.scrollTop = messages.scrollHeight;
			}
```

预期：动态追加的用户和分身消息与初始消息使用同一套 DOM 结构，并且消息正文继续通过 `textContent` 写入。

- [ ] **步骤 2：更新提交状态文案**

在 submit 处理里，将：

```js
				setStatus('正在生成');
```

替换为：

```js
				setStatus('正在生成...');
```

预期：状态文案与 spec 一致。

- [ ] **步骤 3：添加输入法组合状态监听和 Enter 发送**

在 `form.addEventListener('submit', async (event) => { ... });` 之前加入：

```js
			input.addEventListener('compositionstart', () => {
				isComposing = true;
			});

			input.addEventListener('compositionend', () => {
				isComposing = false;
			});

			input.addEventListener('keydown', (event) => {
				if (event.key !== 'Enter' || event.shiftKey || event.isComposing || isComposing) {
					return;
				}

				if (sendButton.disabled || !input.value.trim()) {
					return;
				}

				event.preventDefault();

				if (typeof form.requestSubmit === 'function') {
					form.requestSubmit(sendButton);
					return;
				}

				sendButton.click();
			});
```

预期：`Enter` 会触发表单提交；`Shift+Enter` 仍保留默认换行；中文输入法组词期间按 Enter 不会提交。

- [ ] **步骤 4：运行公共 BOT 测试**

运行：

```powershell
node --test tests/bot-public-profile.test.mjs
```

预期：全部测试通过。该测试不覆盖 UI，但确认本次修改没有碰坏公共 BOT API 和公开人格构造边界。

## 任务 3：追加开发日志

**文件：**
- 修改：`src/data/devlog.json`

- [ ] **步骤 1：查看已有 devlog diff**

运行：

```powershell
git diff -- src/data/devlog.json
```

预期：执行前已存在 `统一 Codex 中文工作语言规则` 相关条目。本任务不能删除或重写它。

- [ ] **步骤 2：通过项目命令追加本次 UI 记录**

运行：

```powershell
npm run devlog:add -- --type style --title "优化公开分身聊天界面" --description "将公开分身页面调整为左右气泡对话，增加 Enter 发送和 Shift+Enter 换行提示，强化访客与分身消息区分。" --tags "bot,chat,ui"
```

预期：输出包含：

```text
Added changelog item: 2026-05-20 样式 - 优化公开分身聊天界面
```

- [ ] **步骤 3：确认最新开发日志包含本次记录**

运行：

```powershell
npm run devlog:latest
```

预期：输出包含 `优化公开分身聊天界面`。如果也显示 `统一 Codex 中文工作语言规则`，那是执行前已存在的无关改动，不要删除。

## 任务 4：构建和浏览器验证

**文件：**
- 读取：`src/pages/bot.astro`
- 读取：`dist/bot/index.html`

- [ ] **步骤 1：运行最终构建**

运行：

```powershell
npm run build
```

预期：构建成功，并显示 `/bot/index.html` 生成成功。

- [ ] **步骤 2：启动本地 Astro 页面**

运行：

```powershell
npm run dev -- --host 127.0.0.1
```

预期：终端输出本地访问地址，通常是 `http://127.0.0.1:4321/`。保持该进程运行，后续浏览器验证使用 `/bot`。

- [ ] **步骤 3：桌面宽度验证聊天 UI**

在浏览器打开：

```text
http://127.0.0.1:4321/bot
```

预期：

- 首条 `直接问就行。` 在左侧公开分身气泡内。
- 气泡旁显示 `分` 标记和 `公开分身` 标签。
- 输入区显示 `Enter 发送 · Shift+Enter 换行`。
- 输入 `你好` 后按 `Enter`，右侧出现访客气泡，气泡旁显示 `你`。
- 如果本地 dev server 没有 `/api/bot/public`，页面会追加一条左侧失败气泡 `这次没有生成成功，稍后再试。`，这仍能证明 Enter 已触发提交和错误气泡渲染。

- [ ] **步骤 4：验证 Shift+Enter 换行**

在 `/bot` 输入框中输入：

```text
第一行
```

按 `Shift+Enter`，再输入：

```text
第二行
```

预期：输入框保留两行内容，没有发送消息；再按一次普通 `Enter` 后，右侧访客气泡保留两行换行显示。

- [ ] **步骤 5：移动端宽度验证布局**

将浏览器视口切到约 `390px` 宽，打开：

```text
http://127.0.0.1:4321/bot
```

预期：

- 气泡、角色标签和头像标记不重叠。
- 访客气泡仍在右侧，公开分身气泡仍在左侧。
- 发送按钮全宽显示在输入框下方。
- 快捷键提示和状态行不遮挡按钮或输入框。

## 任务 5：检查 diff 和提交边界

**文件：**
- 修改：`src/pages/bot.astro`
- 修改：`src/data/devlog.json`
- 保留：`docs/superpowers/plans/2026-05-20-bot-chat-ui.md`

- [ ] **步骤 1：检查总状态**

运行：

```powershell
git status --short
```

预期：至少包含本任务文件：

```text
 M src/pages/bot.astro
 M src/data/devlog.json
?? docs/superpowers/plans/2026-05-20-bot-chat-ui.md
```

也可能继续显示执行前已有的无关文件：

```text
 M AGENTS.md
?? .superpowers/
?? docs/superpowers/plans/2026-05-19-cross-project-chinese-agent-rules.md
```

- [ ] **步骤 2：检查本任务核心 diff**

运行：

```powershell
git diff -- src/pages/bot.astro docs/superpowers/plans/2026-05-20-bot-chat-ui.md
git diff -- src/data/devlog.json
```

预期：

- `src/pages/bot.astro` 只包含聊天气泡 UI、输入提示、动态消息 DOM、IME 和 Enter 发送逻辑。
- `docs/superpowers/plans/2026-05-20-bot-chat-ui.md` 是本计划。
- `src/data/devlog.json` 包含本次 `优化公开分身聊天界面` 条目，也可能包含执行前已有的 `统一 Codex 中文工作语言规则` 条目。

- [ ] **步骤 3：决定是否提交**

如果用户要求提交，并且 `src/data/devlog.json` 仍混有执行前的无关 devlog diff，先暂停并说明：

```text
src/data/devlog.json 已有执行前未提交的中文工作语言规则条目。为了避免把无关改动混进本次 UI 提交，需要你确认是否允许一并提交，或先处理那组改动。
```

如果用户明确允许一并提交，运行：

```powershell
git add -- src/pages/bot.astro src/data/devlog.json docs/superpowers/plans/2026-05-20-bot-chat-ui.md
git diff --cached --stat
git commit -m "style: improve public bot chat ui"
```

预期：提交只在用户确认后进行。不要暂存 `AGENTS.md`、`.superpowers/` 或 `docs/superpowers/plans/2026-05-19-cross-project-chinese-agent-rules.md`。

## 自查

- 需求覆盖：任务 1 覆盖左右气泡、角色标签、头像标记、移动端布局和输入提示；任务 2 覆盖 Enter 发送、Shift+Enter 换行、IME 组合状态、错误气泡和 `textContent`；任务 3 覆盖 devlog；任务 4 覆盖测试和浏览器验证。
- 占位符扫描：没有 `TBD`、`TODO`、`稍后实现` 或未说明的代码步骤。
- 范围检查：计划只改公开分身前端 UI 和必要开发日志，不改 API、公开 prompt、本人模式、私有记忆或部署配置。
- 提交边界：计划明确保护执行前已有的 `AGENTS.md`、`.superpowers/`、跨项目中文规则计划，以及已存在的 devlog diff。
