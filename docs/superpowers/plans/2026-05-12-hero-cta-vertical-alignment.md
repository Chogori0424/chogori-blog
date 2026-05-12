# Hero CTA Vertical Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lower the homepage hero CTA card so its top aligns with the upper-middle area of the avatar/title row instead of the top site-name kicker.

**Architecture:** Keep the existing two-column hero grid. Add a desktop-only top offset to `.hero-cta` and reset it in the existing single-column breakpoint.

**Tech Stack:** Astro page-scoped CSS, existing CSS variables, Astro static build, in-app browser visual verification.

---

### Task 1: Adjust Hero CTA Offset

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add desktop offset**

In the existing `.hero-cta` rule, add:

```css
margin-top: clamp(4rem, 6vw, 5rem);
```

The value should move the right CTA card down by roughly 64-80px on desktop-sized screens, placing the card top around the upper-middle of the left avatar/title row.

- [ ] **Step 2: Reset offset on single-column layout**

Inside the existing `@media (max-width: 900px)` block, add:

```css
.hero-cta {
	margin-top: 0;
}
```

This prevents the CTA from creating an artificial vertical gap when it stacks below the intro copy.

### Task 2: Record and Verify

**Files:**
- Modify: `src/data/devlog.json`
- Test: Astro build output
- Test: in-app browser at `http://127.0.0.1:4321/`

- [ ] **Step 1: Add a style devlog entry**

Run:

```powershell
npm run devlog:add -- --type style --title "微调首页 CTA 垂直对齐" --description "将首页右侧文章入口卡片在桌面端下移，使其顶部与左侧头像和标题区域更自然对齐。" --tags "homepage,hero,ui"
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

- [ ] **Step 4: Browser-check desktop and mobile**

Open or refresh:

```text
http://127.0.0.1:4321/
```

Expected desktop: the right `从文章开始` card top is lower than the left kicker and visually lines up around the upper-middle of the avatar/title row.

Expected mobile: the hero stacks naturally without a large blank gap before the CTA card.

### Task 3: Commit and Push

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/data/devlog.json`
- Create: `docs/superpowers/plans/2026-05-12-hero-cta-vertical-alignment.md`

- [ ] **Step 1: Commit**

Run:

```powershell
git add src/pages/index.astro src/data/devlog.json docs/superpowers/plans/2026-05-12-hero-cta-vertical-alignment.md
git commit -m "style: align homepage hero cta"
```

- [ ] **Step 2: Push**

Run:

```powershell
git push origin main
```
