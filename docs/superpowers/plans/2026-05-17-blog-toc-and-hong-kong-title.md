# Blog TOC And Hong Kong Title Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the Hong Kong article title and add a reusable readable table of contents to blog detail pages.

**Architecture:** Use Astro content `render(post)` headings and pass them into the existing `BlogPost.astro` layout. Render an article-local side navigation when a post has at least two `h2`/`h3` headings, with desktop sticky sidebar and mobile in-flow directory.

**Tech Stack:** Astro 6, Astro content collections, MDX, layout-local CSS, existing devlog tooling.

---

### Task 1: Shorten The Hong Kong Article Title

**Files:**
- Modify: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`

- [x] **Step 1: Update frontmatter title**

Change the article frontmatter title to:

```yaml
title: '5.17 深圳宝龙出发香港一日游'
```

- [x] **Step 2: Update visible H1**

Change the first markdown heading to:

```md
# 5.17 深圳宝龙出发香港一日游
```

### Task 2: Pass Headings To Blog Layout

**Files:**
- Modify: `src/pages/blog/[...slug].astro`

- [x] **Step 1: Destructure headings from render**

Change the render call to:

```astro
const { Content, headings } = await render(post);
```

- [x] **Step 2: Pass headings into BlogPost**

Change the layout invocation to:

```astro
<BlogPost {...post.data} headings={headings}>
	<Content />
</BlogPost>
```

### Task 3: Render Responsive Table Of Contents

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [x] **Step 1: Add headings prop**

Import `MarkdownHeading` from `astro`, add `headings?: MarkdownHeading[]`, and compute:

```ts
const tocHeadings = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
const showToc = tocHeadings.length >= 2;
```

- [x] **Step 2: Wrap article in a layout shell**

Wrap the article in `.post-shell`, render `<aside class="table-of-contents">` after the article when `showToc` is true, and link each item to `#${heading.slug}`.

- [x] **Step 3: Add layout-local CSS**

Use a two-column desktop grid with sticky sidebar. On screens below `1100px`, make the directory in-flow above or below the content without horizontal overflow. Keep article width and existing prose styles intact.

### Task 4: Update Devlog And Verify

**Files:**
- Modify: `src/data/devlog.json`

- [x] **Step 1: Add devlog entry**

Run:

```powershell
npm run devlog:add -- --type improved --title "优化博客文章目录导航" --description "为文章详情页接入基于标题的侧边目录，并缩短香港一日游文章标题提升列表和正文可读性" --tags "博客,目录,文章体验"
```

- [x] **Step 2: Build**

Run:

```powershell
npm run build
```

Expected: exit 0 and the Hong Kong article page builds.

- [x] **Step 3: Existing tests**

Run:

```powershell
node --test tests\bot-public-profile.test.mjs
```

Expected: 7 tests and 0 failures.

- [x] **Step 4: Page checks**

Verify the local article page returns 200, contains `5.17 深圳宝龙出发香港一日游`, contains `.table-of-contents`, and does not include the old long title as the page title.
