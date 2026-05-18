# Mobile Article Overflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile article pages so header, article body, table of contents, and rich content no longer create horizontal overflow or right-edge clipping.

**Architecture:** Use a global border-box reset so padding stays inside declared widths, then tighten the article layout with `minmax(0, ...)`, `min-width: 0`, and mobile-safe padding. Keep the desktop article-plus-TOC grid intact while allowing small screens to stack the TOC above the article.

**Tech Stack:** Astro 6, scoped Astro component styles, global CSS, npm build verification.

---

### Task 1: Global Box Model And Viewport Guard

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add global box sizing near the root styles**

Insert the box model reset after theme variables and before element layout rules:

```css
*,
*::before,
*::after {
	box-sizing: border-box;
}
```

- [ ] **Step 2: Add document-level horizontal guard**

Add this rule before the existing `body` rule so the existing body typography and theme styles remain unchanged:

```css
html,
body {
	max-width: 100%;
	overflow-x: hidden;
}
```

- [ ] **Step 3: Preserve existing body styling**

Keep the current `body` rule values for font, background, wrapping, color, size, line-height, and transition. Do not move theme variables or dark-mode rules.

### Task 2: Article Shell Width Containment

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Contain shell padding**

Update `.post-shell` so padding is included in its width:

```css
.post-shell {
	display: grid;
	grid-template-columns: minmax(0, 820px);
	gap: 2rem;
	box-sizing: border-box;
	width: 100%;
	max-width: 820px;
	margin: 0 auto;
	padding: 48px 24px 96px;
}
```

- [ ] **Step 2: Keep desktop TOC grid**

Keep `.post-shell.has-toc` as a two-column layout on wide screens:

```css
.post-shell.has-toc {
	grid-template-columns: minmax(0, 820px) minmax(180px, 240px);
	align-items: start;
	max-width: 1120px;
}
```

- [ ] **Step 3: Prevent grid children from forcing width**

Add `min-width: 0` to the article, prose, TOC, hero image, and title/meta areas that can contain long text or media:

```css
.post-article,
.prose,
.table-of-contents,
.hero-image,
.title,
.meta,
.tags {
	min-width: 0;
}
```

- [ ] **Step 4: Make mobile shell viewport-safe**

In the `max-width: 720px` media query, update `.post-shell`:

```css
.post-shell {
	width: 100%;
	max-width: 100%;
	padding: 28px 16px 72px;
}
```

### Task 3: Long Content And TOC Wrapping

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Keep prose inside the column**

Update `.prose` with wrapping that handles long prose and URLs without changing code block behavior:

```css
.prose {
	width: 100%;
	max-width: 100%;
	min-width: 0;
	margin: 0;
	padding: 0;
	color: var(--color-text);
	font-size: 18px;
	line-height: 1.85;
	letter-spacing: 0;
	overflow-wrap: anywhere;
}
```

- [ ] **Step 2: Keep TOC links from widening the card**

Add wrapping to `.table-of-contents a`:

```css
.table-of-contents a {
	display: block;
	border-left: 2px solid transparent;
	border-radius: 0 8px 8px 0;
	padding: 0.28rem 0 0.28rem 0.65rem;
	color: inherit;
	text-decoration: none;
	overflow-wrap: anywhere;
}
```

- [ ] **Step 3: Keep media and tables bounded**

Confirm existing hero image and table rules remain bounded:

```css
.hero-image img {
	display: block;
	width: 100%;
	margin: 0 auto;
	border-radius: var(--radius-card);
	box-shadow: var(--box-shadow);
}

:global(.post-article .prose table) {
	display: block;
	max-width: 100%;
	overflow-x: auto;
	border-collapse: collapse;
	font-size: 0.95rem;
}
```

### Task 4: Header Mobile Flex Containment

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Prevent nav children from forcing viewport overflow**

Add `min-width: 0` to `nav`, the brand heading, the brand link, `.nav-actions`, and `.internal-links`:

```css
h2,
.site-brand,
nav,
.nav-actions,
.internal-links {
	min-width: 0;
}
```

- [ ] **Step 2: Keep mobile nav wrapping**

Keep existing mobile behavior where `nav` wraps and `.nav-actions` becomes full width. Ensure `.internal-links` stays `flex-wrap: wrap` and does not use horizontal scrolling.

### Task 5: Development Log

**Files:**
- Modify through command: `src/data/devlog.json`

- [ ] **Step 1: Add a style fix entry**

Run:

```bash
npm run devlog:add -- --type style --title "修复移动端文章页横向溢出" --description "收紧文章页、目录和顶部导航的移动端宽度约束，避免默认缩放时内容右偏或右侧裁切。" --tags "mobile,layout,article"
```

- [ ] **Step 2: Validate latest devlog entries**

Run:

```bash
npm run devlog:latest
```

Expected: the new mobile overflow style entry appears in the latest entries.

### Task 6: Verification

**Files:**
- Read-only verification of built output and local preview.

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected: Astro build completes without errors.

- [ ] **Step 2: Check responsive overflow in preview**

Start preview if needed:

```bash
npm run preview -- --host 127.0.0.1
```

Open an article page at widths 390px, 430px, and desktop. Verify:

- `document.documentElement.scrollWidth <= window.innerWidth`
- `document.body.scrollWidth <= window.innerWidth`
- The article body is visually centered.
- The TOC card does not exceed the viewport.
- The header width does not exceed the viewport.
- Desktop keeps the article plus right TOC layout.

- [ ] **Step 3: Check dark theme**

Toggle dark mode in preview and confirm header, article card spacing, TOC, code blocks, tables, and hero images retain the existing visual style without horizontal overflow.
