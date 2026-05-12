# Radius System Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the blog's border-radius language into three restrained tiers: large cards, ordinary containers, and pill controls/tags.

**Architecture:** Add shared non-color radius variables in `global.css` and replace scattered `6px`, `8px`, `12px`, `50%`, and `999px` values in page/layout components with the appropriate tier. Do not change `QianPet.astro`, because its irregular radii are part of the pixel-character artwork.

**Tech Stack:** Astro scoped styles, global CSS variables, repo devlog script, Astro static build, in-app browser visual verification.

---

### Task 1: Add Shared Radius Variables

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add the three radius tiers**

Add these variables in the top-level `:root` block:

```css
--radius-card: 24px;
--radius-container: 16px;
--radius-pill: 999px;
```

- [ ] **Step 2: Update global defaults**

Use:

```css
img {
	border-radius: var(--radius-container);
}
code {
	border-radius: var(--radius-container);
}
pre {
	border-radius: var(--radius-container);
}
```

### Task 2: Replace Component and Page Radii

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/PostCard.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/CodeCopy.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/ScrollMemoryButton.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/categories/index.astro`
- Modify: `src/pages/categories/[slug].astro`
- Modify: `src/pages/devlog.astro`
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Use `var(--radius-card)` for large card surfaces**

Apply to:

```css
.hero-cta
.rss-cta
.post-card
.hero-image img
```

- [ ] **Step 2: Use `var(--radius-container)` for ordinary containers**

Apply to:

```css
.category-card
.footer-note
.info-card
.empty
.date-card
```

- [ ] **Step 3: Use `var(--radius-pill)` for tags, buttons, dots, and circular avatars**

Apply to:

```css
.hero-avatar
.about-avatar
.profile-meta span
.primary-cta
.rss-cta-button
.rss-icon
.post-card-gradient span
.category-nav a
.badge
.tag
.category-dot
.change-list li::before
.code-copy-button
.site-avatar
.scroll-memory-button
```

### Task 3: Record and Verify

**Files:**
- Modify: `src/data/devlog.json`
- Test: `npm run build`
- Test: `git diff --check`
- Test: in-app browser at `http://127.0.0.1:4321/`

- [ ] **Step 1: Add a style devlog entry**

Run:

```powershell
npm run devlog:add -- --type style --title "统一全站圆角语言" --description "收敛页面和组件的圆角层级，统一为大卡片、普通容器和胶囊控件三类视觉规则。" --tags "ui,radius,design"
```

- [ ] **Step 2: Run static build**

Run:

```powershell
npm run build
```

Expected: Astro build completes successfully.

- [ ] **Step 3: Check Git whitespace**

Run:

```powershell
git diff --check
```

Expected: no errors and exit code `0`.

- [ ] **Step 4: Inspect remaining radius values**

Run:

```powershell
rg -n "border-radius: (2px|5px|6px|7px|8px|9px|11px|12px|20px|26px|50%|999px)" src --glob "!components/QianPet.astro"
```

Expected: no output outside intentionally excluded `QianPet.astro`.

- [ ] **Step 5: Browser-check key pages**

Open or refresh:

```text
http://127.0.0.1:4321/
http://127.0.0.1:4321/blog/
http://127.0.0.1:4321/about/
http://127.0.0.1:4321/devlog/
```

Expected: card and container rounding is visually consistent; labels and primary buttons stay pill-shaped.

### Task 4: Commit and Push

**Files:**
- Commit all modified files and this plan.

- [ ] **Step 1: Commit**

Run:

```powershell
git add src docs/superpowers/plans/2026-05-12-radius-system-unification.md
git commit -m "style: unify radius system"
```

- [ ] **Step 2: Push**

Run:

```powershell
git push origin main
```
