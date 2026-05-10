# Codex App Color System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the blog's light and dark theme colors with the current Codex app color settings confirmed by the user.

**Architecture:** Keep the existing Astro static site structure and theme switcher unchanged. Implement the color change at the CSS variable layer in `src/styles/global.css`, then replace the one known hard-coded old link color in `src/pages/devlog.astro`.

**Tech Stack:** Astro, Markdown/MDX content, plain CSS variables, vanilla browser theme switching, npm build verification.

---

## File Structure

- Modify: `src/styles/global.css`
  - Owns global theme variables, base body colors, link colors, code colors, tags, selection, focus rings, and shared color aliases.
- Modify: `src/pages/devlog.astro`
  - Contains one hard-coded old blue value in a no-motion fallback style that should use the global Codex accent.
- Modify: `src/data/devlog.json`
  - Records the theme style change before the implementation commit.
- Do not modify:
  - `src/components/ThemeToggle.astro`
  - `src/components/QianPet.astro`
  - `src/components/ScrollMemoryButton.astro`
  - `public/admin/**`
  - Vercel, Cloudflare, GitHub OAuth, or Decap CMS configuration.

---

### Task 1: Update Global Theme Variables

**Files:**
- Modify: `src/styles/global.css:7-145`

- [ ] **Step 1: Inspect current variable blocks**

Run:

```bash
rg -n "data-theme|--color-|#0abab5|#08a09b|#212121|#2f2f2f|#383838|#7ab7f5|#ececec|#8e8ea0" src/styles/global.css
```

Expected:

- Matches in `:root`
- Matches in `@media (prefers-color-scheme: dark)`
- Matches in `[data-theme='dark']`
- No implementation files outside `src/styles/global.css` are changed in this task.

- [ ] **Step 2: Replace the `:root` block with Codex light variables**

In `src/styles/global.css`, replace the existing `:root { ... }` variable block at the top of the file with:

```css
:root {
	color-scheme: light;
	--color-bg: #ffffff;
	--color-bg-secondary: #f6f7f8;
	--color-bg-hover: #eef2f6;
	--color-text: #1a1c1f;
	--color-text-muted: #667085;
	--color-border: #d8dce2;
	--color-link: #339cff;
	--color-link-hover: #1f8df5;
	--color-code-bg: #f6f7f8;
	--color-code-text: #1a1c1f;
	--color-code-border: #d8dce2;
	--color-inline-code-bg: #eef2f6;
	--color-inline-code-text: #2563eb;
	--color-card-bg: #ffffff;
	--color-card-border: #d8dce2;
	--color-scrollbar: #f1f3f5;
	--color-scrollbar-thumb: #c8ced8;
	--color-accent: #339cff;
	--color-accent-hover: #1f8df5;
	--color-accent-muted: #339cff33;
	--accent: var(--color-accent);
	--accent-dark: var(--color-accent-hover);
	--black: 26, 28, 31;
	--gray: 102, 112, 133;
	--gray-light: 216, 220, 226;
	--gray-dark: 26, 28, 31;
	--gray-gradient: rgba(var(--gray-light), 48%), var(--color-bg);
	--background: var(--color-bg);
	--surface: var(--color-card-bg);
	--surface-soft: var(--color-bg-secondary);
	--border-color: var(--color-border);
	--code-bg: var(--color-inline-code-bg);
	--code-block-bg: var(--color-code-bg);
	--header-shadow: 0 2px 8px rgba(var(--black), 6%);
	--box-shadow:
		0 2px 6px rgba(var(--gray), 16%), 0 8px 24px rgba(var(--gray), 20%),
		0 16px 32px rgba(var(--gray), 18%);
}
```

- [ ] **Step 3: Replace the system dark fallback block with Codex dark variables**

Inside `@media (prefers-color-scheme: dark)`, replace the whole `:root:not([data-theme='light']) { ... }` block with:

```css
	:root:not([data-theme='light']) {
		color-scheme: dark;
		--color-bg: #181818;
		--color-bg-secondary: #202020;
		--color-bg-hover: #2a2a2a;
		--color-text: #ffffff;
		--color-text-muted: #b3b3b3;
		--color-border: #343434;
		--color-link: #339cff;
		--color-link-hover: #66b5ff;
		--color-code-bg: #202020;
		--color-code-text: #ffffff;
		--color-code-border: #343434;
		--color-inline-code-bg: #242424;
		--color-inline-code-text: #9fcdff;
		--color-card-bg: #242424;
		--color-card-border: #343434;
		--color-scrollbar: #242424;
		--color-scrollbar-thumb: #555555;
		--color-accent: #339cff;
		--color-accent-hover: #66b5ff;
		--color-accent-muted: #339cff33;
		--accent: var(--color-accent);
		--accent-dark: var(--color-accent-hover);
		--black: 255, 255, 255;
		--gray: 179, 179, 179;
		--gray-light: 52, 52, 52;
		--gray-dark: 255, 255, 255;
		--gray-gradient: var(--color-bg), var(--color-bg);
		--background: var(--color-bg);
		--surface: var(--color-card-bg);
		--surface-soft: var(--color-bg-secondary);
		--border-color: var(--color-border);
		--code-bg: var(--color-inline-code-bg);
		--code-block-bg: var(--color-code-bg);
		--header-shadow: 0 2px 10px rgba(0, 0, 0, 36%);
		--box-shadow:
			0 2px 8px rgba(0, 0, 0, 26%), 0 12px 28px rgba(0, 0, 0, 34%),
			0 18px 36px rgba(0, 0, 0, 30%);
	}
```

- [ ] **Step 4: Replace the explicit dark theme block with the same Codex dark variables**

Replace the whole `[data-theme='dark'] { ... }` block with:

```css
[data-theme='dark'] {
	color-scheme: dark;
	--color-bg: #181818;
	--color-bg-secondary: #202020;
	--color-bg-hover: #2a2a2a;
	--color-text: #ffffff;
	--color-text-muted: #b3b3b3;
	--color-border: #343434;
	--color-link: #339cff;
	--color-link-hover: #66b5ff;
	--color-code-bg: #202020;
	--color-code-text: #ffffff;
	--color-code-border: #343434;
	--color-inline-code-bg: #242424;
	--color-inline-code-text: #9fcdff;
	--color-card-bg: #242424;
	--color-card-border: #343434;
	--color-scrollbar: #242424;
	--color-scrollbar-thumb: #555555;
	--color-accent: #339cff;
	--color-accent-hover: #66b5ff;
	--color-accent-muted: #339cff33;
	--accent: var(--color-accent);
	--accent-dark: var(--color-accent-hover);
	--black: 255, 255, 255;
	--gray: 179, 179, 179;
	--gray-light: 52, 52, 52;
	--gray-dark: 255, 255, 255;
	--gray-gradient: var(--color-bg), var(--color-bg);
	--background: var(--color-bg);
	--surface: var(--color-card-bg);
	--surface-soft: var(--color-bg-secondary);
	--border-color: var(--color-border);
	--code-bg: var(--color-inline-code-bg);
	--code-block-bg: var(--color-code-bg);
	--header-shadow: 0 2px 10px rgba(0, 0, 0, 36%);
	--box-shadow:
		0 2px 8px rgba(0, 0, 0, 26%), 0 12px 28px rgba(0, 0, 0, 34%),
		0 18px 36px rgba(0, 0, 0, 30%);
}
```

- [ ] **Step 5: Expand the explicit light theme block**

Replace the current short `[data-theme='light'] { color-scheme: light; }` block with:

```css
[data-theme='light'] {
	color-scheme: light;
	--color-bg: #ffffff;
	--color-bg-secondary: #f6f7f8;
	--color-bg-hover: #eef2f6;
	--color-text: #1a1c1f;
	--color-text-muted: #667085;
	--color-border: #d8dce2;
	--color-link: #339cff;
	--color-link-hover: #1f8df5;
	--color-code-bg: #f6f7f8;
	--color-code-text: #1a1c1f;
	--color-code-border: #d8dce2;
	--color-inline-code-bg: #eef2f6;
	--color-inline-code-text: #2563eb;
	--color-card-bg: #ffffff;
	--color-card-border: #d8dce2;
	--color-scrollbar: #f1f3f5;
	--color-scrollbar-thumb: #c8ced8;
	--color-accent: #339cff;
	--color-accent-hover: #1f8df5;
	--color-accent-muted: #339cff33;
	--accent: var(--color-accent);
	--accent-dark: var(--color-accent-hover);
	--black: 26, 28, 31;
	--gray: 102, 112, 133;
	--gray-light: 216, 220, 226;
	--gray-dark: 26, 28, 31;
	--gray-gradient: rgba(var(--gray-light), 48%), var(--color-bg);
	--background: var(--color-bg);
	--surface: var(--color-card-bg);
	--surface-soft: var(--color-bg-secondary);
	--border-color: var(--color-border);
	--code-bg: var(--color-inline-code-bg);
	--code-block-bg: var(--color-code-bg);
	--header-shadow: 0 2px 8px rgba(var(--black), 6%);
	--box-shadow:
		0 2px 6px rgba(var(--gray), 16%), 0 8px 24px rgba(var(--gray), 20%),
		0 16px 32px rgba(var(--gray), 18%);
}
```

- [ ] **Step 6: Verify old theme colors are gone from global variables**

Run:

```bash
rg -n "#0abab5|#08a09b|#0ABAB5|#212121|#2f2f2f|#383838|#7ab7f5|#ececec|#8e8ea0" src/styles/global.css
```

Expected:

- No matches.

---

### Task 2: Remove the Known Hard-Coded Old Link Color

**Files:**
- Modify: `src/pages/devlog.astro`

- [ ] **Step 1: Locate hard-coded old theme colors outside global variables**

Run:

```bash
rg -n "#0abab5|#08a09b|#0ABAB5|#212121|#2f2f2f|#383838|#7ab7f5|#ececec|#8e8ea0" src -S
```

Expected before this task:

- `src/pages/devlog.astro` contains `background: #7ab7f5;`.

- [ ] **Step 2: Replace the hard-coded devlog fallback color**

In `src/pages/devlog.astro`, replace:

```css
				background: #7ab7f5;
```

with:

```css
				background: var(--color-accent);
```

- [ ] **Step 3: Verify no old theme colors remain in `src`**

Run:

```bash
rg -n "#0abab5|#08a09b|#0ABAB5|#212121|#2f2f2f|#383838|#7ab7f5|#ececec|#8e8ea0" src -S
```

Expected:

- No matches.

---

### Task 3: Update Development Log

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: Append a style changelog entry**

Run:

```bash
npm run devlog:add -- --type style --title "对齐 Codex App 色彩标准" --description "将全站亮色与深色主题变量调整为 Codex App 的蓝色强调、白色亮色背景、近黑深色背景和高对比前景色。" --tags "theme,color,codex"
```

Expected:

- The command exits with code `0`.
- `src/data/devlog.json` changes.

- [ ] **Step 2: Inspect the devlog diff**

Run:

```bash
git diff -- src/data/devlog.json
```

Expected acceptable content:

```json
{
  "date": "2026-05-11",
  "items": {
    "added": [],
    "improved": [],
    "fixed": [],
    "removed": [],
    "docs": [],
    "style": [
      "对齐 Codex App 色彩标准：将全站亮色与深色主题变量调整为 Codex App 的蓝色强调、白色亮色背景、近黑深色背景和高对比前景色。"
    ]
  }
}
```

If the script writes a malformed separator such as `锛?{description}`, replace only the new `2026-05-11` entry with the JSON shown above and keep the rest of the file structure unchanged.

- [ ] **Step 3: Check latest changelog output**

Run:

```bash
npm run devlog:latest
```

Expected:

- The newest date is `2026-05-11`.
- The style entry mentions `对齐 Codex App 色彩标准`.

---

### Task 4: Build and Commit

**Files:**
- Verify: `src/styles/global.css`
- Verify: `src/pages/devlog.astro`
- Verify: `src/data/devlog.json`

- [ ] **Step 1: Run build**

Run:

```bash
npm run build
```

Expected:

- Astro build exits with code `0`.
- Output includes `Complete!`.
- `sitemap-index.xml` is generated in `dist`.

- [ ] **Step 2: Check git status**

Run:

```bash
git status --short --branch
```

Expected changed files:

```text
## main...origin/main
 M src/data/devlog.json
 M src/pages/devlog.astro
 M src/styles/global.css
```

No `.env`, `.env.*`, `.vercel`, `node_modules`, or `dist` files should be staged or committed.

- [ ] **Step 3: Commit and push**

Run:

```bash
git add src/styles/global.css src/pages/devlog.astro src/data/devlog.json
git commit -m "style: align theme with Codex app colors"
git push origin main
```

Expected:

- Commit succeeds on `main`.
- Push succeeds to `https://github.com/Chogori0424/chogori-blog.git`.
- Vercel starts a new deployment from `main`.

---

### Task 5: Optional Local Visual Check

**Files:**
- No file changes.

- [ ] **Step 1: Start local dev server**

Run:

```bash
npm run dev
```

Expected:

- Astro dev server starts.
- Local URL is shown, usually `http://localhost:4321/`.

- [ ] **Step 2: Check key pages in both themes**

Open these pages:

```text
http://localhost:4321/
http://localhost:4321/blog/
http://localhost:4321/devlog/
http://localhost:4321/blog/ios-update-cellular-apple-cdn-surge/
```

Expected:

- Dark mode background visually matches Codex app `#181818`.
- Dark mode text is white and readable.
- Links, tags, focus rings, buttons, current navigation, and selected text use Codex blue.
- Article code blocks remain readable.
- QianPet and ScrollMemoryButton still render and do not overlap.

---

## Self-Review

- Spec coverage: all source palette values, dark and light theme mappings, hard-coded color cleanup, devlog update, build verification, and push requirements are covered.
- Completeness scan: no unresolved implementation gaps are present.
- Scope check: the plan is limited to one color-system implementation and does not change page layout, Markdown content, deployment, CMS, OAuth, or domain configuration.
