# Footer Nav Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the footer navigation visually consistent by changing every footer nav item to the same single-line link treatment.

**Architecture:** Keep the existing footer component and route structure. Move the development-log explanation out of visible navigation text and preserve it as accessible/link metadata, so the nav row has one repeated link pattern.

**Tech Stack:** Astro component CSS, existing CSS variables, repo devlog script, Astro static build.

---

### Task 1: Normalize Footer Navigation

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace the special development-log nav markup**

Change the current two-line `footer-devlog-link` anchor:

```astro
<a class="footer-devlog-link" href="/devlog">
	<span>开发日志</span>
	<small>记录博客本身的搭建与迭代过程</small>
</a>
```

to a normal single-line anchor with metadata:

```astro
<a
	href="/devlog"
	title="记录博客本身的搭建与迭代过程"
	aria-label="开发日志：记录博客本身的搭建与迭代过程"
>
	开发日志
</a>
```

- [ ] **Step 2: Remove now-unused special CSS**

Delete these rules from the same file:

```css
.footer-devlog-link {
	display: inline-grid;
	gap: 0.1rem;
}
.footer-devlog-link small {
	color: var(--color-text-muted);
	font-size: 0.78rem;
	font-weight: 400;
}
```

- [ ] **Step 3: Confirm route structure is unchanged**

Run:

```powershell
rg -n 'href="/devlog"|footer-devlog-link|记录博客本身的搭建与迭代过程' src/components/Footer.astro
```

Expected:

```text
src/components/Footer.astro:<line>:			href="/devlog"
src/components/Footer.astro:<line>:			title="记录博客本身的搭建与迭代过程"
src/components/Footer.astro:<line>:			aria-label="开发日志：记录博客本身的搭建与迭代过程"
```

The old `footer-devlog-link` class should not appear.

### Task 2: Record Devlog Entry

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: Add a style devlog entry**

Run:

```powershell
npm run devlog:add -- --type style --title "统一底部导航样式" --description "将页脚导航中的开发日志改为单行链接，并保留说明为链接提示，统一底部导航视觉基线。" --tags "footer,ui"
```

- [ ] **Step 2: Confirm latest devlog output**

Run:

```powershell
npm run devlog:latest
```

Expected: latest `style` group includes `统一底部导航样式`.

### Task 3: Verify and Commit

**Files:**
- Test: Astro build output
- Test: in-app browser at `http://127.0.0.1:4321/`

- [ ] **Step 1: Run static build**

Run:

```powershell
npm run build
```

Expected: Astro build completes successfully.

- [ ] **Step 2: Check Git whitespace**

Run:

```powershell
git diff --check
```

Expected: no output and exit code `0`.

- [ ] **Step 3: Verify footer visually in browser**

Open or refresh:

```text
http://127.0.0.1:4321/
```

Expected: footer nav items are all single-line links with consistent size and baseline.

- [ ] **Step 4: Commit and push**

Run:

```powershell
git add src/components/Footer.astro src/data/devlog.json docs/superpowers/plans/2026-05-12-footer-nav-unification.md
git commit -m "style: unify footer navigation"
git push origin main
```
