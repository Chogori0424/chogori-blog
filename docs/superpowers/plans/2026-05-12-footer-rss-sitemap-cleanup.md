# Footer RSS Sitemap Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep RSS visible for readers while removing Sitemap from the main footer navigation.

**Architecture:** Update only the existing footer component. The sitemap URL remains linked inside the site explanation block, while the navigation row contains visitor-facing links only.

**Tech Stack:** Astro component markup, existing CSS variables, repo devlog script, Astro static build.

---

### Task 1: Adjust Footer Links

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Rename the RSS navigation label**

Change:

```astro
<a href="/rss.xml">RSS</a>
```

inside `.footer-nav` to:

```astro
<a href="/rss.xml">RSS 订阅</a>
```

- [ ] **Step 2: Remove Sitemap from the visible footer nav**

Delete this anchor from `.footer-nav`:

```astro
<a href="/sitemap-index.xml">Sitemap</a>
```

- [ ] **Step 3: Keep sitemap in the site explanation**

Confirm this explanatory link still exists in `footer-note`:

```astro
<a href="/sitemap-index.xml">sitemap</a>
```

### Task 2: Record and Verify

**Files:**
- Modify: `src/data/devlog.json`
- Test: Astro build output
- Test: in-app browser at `http://127.0.0.1:4321/`

- [ ] **Step 1: Add a style devlog entry**

Run:

```powershell
npm run devlog:add -- --type style --title "精简底部工具链接" --description "保留 RSS 订阅入口，移除页脚导航中的 Sitemap，并将 sitemap 保留在站点说明中。" --tags "footer,rss,sitemap"
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

- [ ] **Step 4: Browser-check footer copy**

Open or refresh:

```text
http://127.0.0.1:4321/
```

Expected: the footer nav shows `RSS 订阅` and does not show `Sitemap`; the site explanation still includes the lower-case `sitemap` link.

### Task 3: Commit and Push

**Files:**
- Modify: `src/components/Footer.astro`
- Modify: `src/data/devlog.json`
- Create: `docs/superpowers/plans/2026-05-12-footer-rss-sitemap-cleanup.md`

- [ ] **Step 1: Commit**

Run:

```powershell
git add src/components/Footer.astro src/data/devlog.json docs/superpowers/plans/2026-05-12-footer-rss-sitemap-cleanup.md
git commit -m "style: refine footer utility links"
```

- [ ] **Step 2: Push**

Run:

```powershell
git push origin main
```
