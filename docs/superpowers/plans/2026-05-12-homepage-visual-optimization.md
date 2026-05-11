# Homepage Visual Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved balanced homepage visual optimization for Chogori Blog.

**Architecture:** Keep Astro static rendering and the existing route/content model. Update page-scoped homepage CSS for hero, category direction cards, and RSS CTA; update shared components for post cards, header navigation, footer site metadata, and theme-toggle title.

**Tech Stack:** Astro 6, Markdown/MDX content collections, component-scoped Astro CSS, existing CSS variables from `src/styles/global.css`.

---

## File Structure

- Modify: `src/pages/index.astro`
  - Owns homepage data shaping and layout.
  - Will derive latest post per category, merge duplicate hero intro into the left column, replace the right profile card with a CTA panel, upgrade `技术方向`, and replace the main `站点说明` block with an RSS CTA strip.
- Modify: `src/components/PostCard.astro`
  - Owns article-card presentation across homepage and article-list pages.
  - Will replace mixed image covers with category gradient covers and add whole-card hover translation.
- Modify: `src/components/Header.astro`
  - Owns primary navigation.
  - Will remove `开发日志` from primary navigation.
- Modify: `src/components/Footer.astro`
  - Owns footer navigation and site metadata.
  - Will receive the moved `站点说明` content and the `开发日志` explanatory footer link.
- Modify: `src/components/ThemeToggle.astro`
  - Owns theme toggle button.
  - Will add the requested title tooltip.
- Modify: `src/data/devlog.json`
  - Must be updated through `npm run devlog:add` after code changes and before the implementation commit.
- Do not modify: `src/content/blog/*.{md,mdx}`, routing files, Cloudflare/Vercel/Decap/GitHub OAuth config, `.vercel`, `dist`, or `.superpowers/`.

---

### Task 1: Baseline Verification

**Files:**
- Read: `src/pages/index.astro`
- Read: `src/components/PostCard.astro`
- Read: `src/components/Header.astro`
- Read: `src/components/Footer.astro`
- Read: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Confirm working tree state**

Run:

```bash
git status --short --branch
```

Expected:

```text
## main...origin/main [ahead 2]
?? .superpowers/
```

If other tracked files are modified, inspect them before editing and do not revert unrelated user changes.

- [ ] **Step 2: Run baseline build**

Run:

```bash
npm run build
```

Expected: build completes with `Complete!` and generates static routes including `/index.html`, `/blog/index.html`, `/categories/index.html`, `/devlog/index.html`, and `/rss.xml`.

---

### Task 2: Update Shared Article Card Covers

**Files:**
- Modify: `src/components/PostCard.astro`

- [ ] **Step 1: Remove image rendering dependency and derive category class**

Edit the frontmatter at the top of `src/components/PostCard.astro` so it no longer imports `Image`, no longer reads `heroImage`, and maps known categories to gradient class names:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
	post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;

const title = post?.data?.title || 'Untitled';
const description = post?.data?.description?.trim();
const category = post?.data?.category;
const href = `/blog/${post.id}/`;
const dateValue = post?.data?.pubDate;
const date = dateValue instanceof Date ? dateValue : dateValue ? new Date(dateValue) : null;
const formattedDate = date && !Number.isNaN(date.valueOf()) ? date.toISOString().slice(0, 10) : '';
const hasMeta = Boolean(category || formattedDate);

const categoryClassMap: Record<string, string> = {
	网络代理: 'is-network-proxy',
	工程制造: 'is-engineering',
	音频设备: 'is-audio',
	个人日志: 'is-personal',
};
const categoryClass = category ? categoryClassMap[category] || 'is-default' : 'is-default';
const coverLabel = category || 'Chogori Blog';
---
```

- [ ] **Step 2: Replace the cover template with a gradient block**

Replace the current conditional `<Image>` / fallback block inside `<a class="post-card-cover">` with:

```astro
<a class="post-card-cover" href={href} aria-label={title}>
	<div class:list={['post-card-gradient', categoryClass]} aria-hidden="true">
		<span>{coverLabel}</span>
	</div>
</a>
```

Expected behavior: every article card now uses the category label as centered gradient cover text and ignores `heroImage` only at card-display time.

- [ ] **Step 3: Replace image/fallback CSS with category gradient CSS**

In the `<style>` block, remove `.post-card-image`, `.post-card:hover .post-card-image`, `.post-card-fallback`, and `.post-card-fallback span`.

Add these rules after `.post-card-cover`:

```css
.post-card-gradient {
	display: flex;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #1d4ed8, #0f766e);
}

.post-card-gradient span {
	border: 1px solid color-mix(in srgb, #ffffff 48%, transparent);
	border-radius: 999px;
	background: color-mix(in srgb, #ffffff 18%, transparent);
	color: #ffffff;
	padding: 0.35rem 0.85rem;
	font-size: 0.9rem;
	font-weight: 800;
	letter-spacing: 0;
	text-shadow: 0 1px 10px rgba(0, 0, 0, 0.28);
}

.post-card-gradient.is-network-proxy {
	background: linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%);
}

.post-card-gradient.is-engineering {
	background: linear-gradient(135deg, #ea580c 0%, #b45309 100%);
}

.post-card-gradient.is-audio {
	background: linear-gradient(135deg, #475569 0%, #0891b2 100%);
}

.post-card-gradient.is-personal {
	background: linear-gradient(135deg, #db2777 0%, #7c3aed 100%);
}

.post-card-gradient.is-default {
	background: linear-gradient(135deg, #334155 0%, #2563eb 100%);
}
```

- [ ] **Step 4: Add whole-card hover translation**

Update `.post-card` transition to include transform:

```css
.post-card {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: 0;
	overflow: hidden;
	border: 1px solid color-mix(in srgb, var(--color-card-border) 78%, transparent);
	border-radius: 12px;
	background: color-mix(in srgb, var(--surface) 88%, var(--color-bg-secondary));
	transition:
		transform 0.2s ease,
		background-color 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}
```

Update `.post-card:hover`:

```css
.post-card:hover {
	transform: translateY(-4px);
	border-color: color-mix(in srgb, var(--color-accent) 55%, var(--color-card-border));
	background: color-mix(in srgb, var(--surface) 72%, var(--color-bg-hover));
}
```

- [ ] **Step 5: Keep reduced motion correct**

Replace the current reduced-motion block with:

```css
@media (prefers-reduced-motion: reduce) {
	.post-card,
	.post-card-title a,
	.post-card-more {
		transition: none;
	}

	.post-card:hover {
		transform: none;
	}
}
```

- [ ] **Step 6: Run build after card change**

Run:

```bash
npm run build
```

Expected: build passes. The build should no longer generate optimized images for post-card covers from `PostCard.astro`, because the shared cards no longer render `astro:assets` images.

---

### Task 3: Update Homepage Hero, Directions, And RSS CTA

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update homepage data shaping**

Remove `SITE_URL` from the import list because the site-note copy moves to the footer.

Replace the current `categories` assignment with:

```astro
const categories = BLOG_CATEGORIES.map((category) => {
	const categoryPosts = posts
		.filter((post) => post.data.category === category.name)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return {
		...category,
		count: categoryPosts.length,
		latestPost: categoryPosts[0],
	};
});
```

- [ ] **Step 2: Replace the hero markup**

Replace the entire current `<section class="hero">...</section>` with:

```astro
<section class="hero">
	<div class="hero-copy">
		<p class="kicker">chogori.xyz / 个人技术博客</p>
		<div class="hero-title-row">
			<img class="hero-avatar" src={AUTHOR_AVATAR} alt={AUTHOR_NAME} width="72" height="72" />
			<h1>{SITE_TITLE}</h1>
		</div>
		<p>
			我是 {AUTHOR_NAME}，模具注塑工艺工程师。这里记录网络代理配置、工程制造、CAD/UG、
			音频设备和个人知识管理相关的实践笔记。
		</p>
		<p>
			站点会优先保留问题背景、排查过程、配置取舍和后续维护思路，让零散经验变成能长期复用的资料。
		</p>
		<div class="profile-meta">
			<span>Surge / Quantumult X</span>
			<span>Siemens NX / UG</span>
			<span>模具注塑工艺</span>
			<span>音频设备</span>
		</div>
	</div>
	<aside class="hero-cta" aria-label="文章入口">
		<p class="cta-eyebrow">从文章开始</p>
		<h2>按时间查看技术记录，或用 RSS 跟进后续更新。</h2>
		<a class="primary-cta" href="/blog">查看所有文章 →</a>
		<a class="rss-subtle-link" href="/rss.xml">RSS 订阅</a>
	</aside>
</section>
```

Expected: the old `<aside class="profile-panel">` and its duplicated `个人简介` content are gone.

- [ ] **Step 3: Replace technical directions markup**

Replace the current `direction-grid` category map with:

```astro
<div class="direction-grid">
	{
		categories.map((category) => (
			<article class="category-card">
				<div>
					<p class="category-count" aria-label={`${category.count} 篇文章`}>
						{category.count}
					</p>
					<h3>
						<a href={`/categories/${category.slug}/`}>{category.name}</a>
					</h3>
				</div>
				<p>{category.description}</p>
				<p class="latest-post">
					{category.latestPost ? (
						<>
							<span>最新：</span>
							<a href={`/blog/${category.latestPost.id}/`}>{category.latestPost.data.title}</a>
						</>
					) : (
						<span>最新：待整理</span>
					)}
				</p>
			</article>
		))
	}
</div>
```

Expected: the card itself is no longer one giant anchor, so the category link and latest-article link can coexist without nested anchors.

- [ ] **Step 4: Replace site note with RSS CTA strip**

Replace the current `<section class="section site-note">...</section>` with:

```astro
<section class="section rss-cta" aria-labelledby="rss-cta-title">
	<div class="rss-icon" aria-hidden="true">
		<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<path d="M4 11a9 9 0 0 1 9 9" />
			<path d="M4 4a16 16 0 0 1 16 16" />
			<circle cx="5" cy="19" r="1" />
		</svg>
	</div>
	<div>
		<h2 id="rss-cta-title">订阅 RSS，获取最新文章更新</h2>
		<p>新文章发布后可通过 RSS 阅读器跟进，适合长期保存和跨设备同步。</p>
	</div>
	<a class="rss-cta-button" href="/rss.xml">订阅 RSS</a>
</section>
```

- [ ] **Step 5: Replace homepage style block with the updated rules**

Within `src/pages/index.astro`, update the `<style>` block so it contains these homepage-specific rules:

```css
main {
	width: 1080px;
}
.hero {
	display: grid;
	grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
	gap: 2rem;
	align-items: stretch;
	margin-bottom: 2.5rem;
}
.kicker {
	margin: 0 0 0.65rem;
	color: var(--color-text-muted);
	font-size: 0.9rem;
	font-weight: 700;
}
.hero-title-row {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
}
.hero-avatar {
	flex: 0 0 auto;
	width: 72px;
	height: 72px;
	border: 1px solid var(--color-card-border);
	border-radius: 50%;
	object-fit: cover;
	object-position: center;
}
.hero h1 {
	margin: 0;
	font-size: 3rem;
}
.hero p {
	max-width: 760px;
	margin: 0 0 1rem;
}
.profile-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 1.25rem;
}
.profile-meta span {
	display: inline-flex;
	border: 1px solid var(--color-accent);
	border-radius: 999px;
	padding: 0.18rem 0.62rem;
	background: var(--color-accent-muted);
	color: var(--color-text);
	font-size: 0.82rem;
	font-weight: 700;
}
.hero-cta,
.rss-cta {
	border: 1px solid var(--color-card-border);
	border-radius: 8px;
	background: var(--surface-soft);
	padding: 1.1rem;
	transition:
		background-color 0.3s ease,
		border-color 0.3s ease,
		color 0.3s ease;
}
.hero-cta {
	display: grid;
	align-content: center;
	gap: 0.85rem;
}
.cta-eyebrow {
	margin: 0;
	color: var(--color-text-muted);
	font-size: 0.82rem;
	font-weight: 700;
}
.hero-cta h2 {
	margin: 0;
	font-size: 1.35rem;
	line-height: 1.35;
}
.primary-cta,
.rss-cta-button {
	display: inline-flex;
	width: fit-content;
	align-items: center;
	justify-content: center;
	border: 1px solid var(--color-accent);
	border-radius: 999px;
	background: var(--color-accent);
	color: #ffffff;
	font-size: 0.95rem;
	font-weight: 800;
	line-height: 1.2;
	padding: 0.55rem 0.95rem;
	text-decoration: none;
	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		transform 0.2s ease;
}
.primary-cta:hover,
.primary-cta:focus-visible,
.rss-cta-button:hover,
.rss-cta-button:focus-visible {
	border-color: var(--color-accent-hover);
	background: var(--color-accent-hover);
	color: #ffffff;
	transform: translateY(-1px);
}
.rss-subtle-link {
	width: fit-content;
	color: var(--color-text-muted);
	font-size: 0.92rem;
	font-weight: 700;
	text-decoration: none;
}
.rss-subtle-link:hover,
.rss-subtle-link:focus-visible {
	color: var(--color-accent-hover);
}
.section {
	margin-top: 2.5rem;
}
.section-title {
	margin: 0 0 0.85rem;
	font-size: 1.35rem;
}
.latest-list {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.5rem;
	align-items: stretch;
	list-style: none;
	margin: 0;
	padding: 0;
}
.latest-list > li {
	min-width: 0;
	height: 100%;
}
.direction-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1rem;
}
.category-card {
	display: grid;
	gap: 0.75rem;
	border: 1px solid var(--color-card-border);
	border-radius: 8px;
	background: var(--surface-soft);
	padding: 1rem;
	color: var(--color-text);
	transition:
		background-color 0.3s ease,
		border-color 0.3s ease,
		color 0.3s ease,
		transform 0.2s ease;
}
.category-card:hover {
	transform: translateY(-2px);
	border-color: var(--color-accent);
}
.category-count {
	margin: 0 0 0.45rem;
	color: var(--color-accent-hover);
	font-size: 2.5rem;
	font-weight: 900;
	line-height: 1;
}
.category-card h3 {
	margin: 0;
	font-size: 1.05rem;
}
.category-card h3 a,
.latest-post a {
	color: var(--color-text);
	text-decoration: none;
}
.category-card h3 a:hover,
.category-card h3 a:focus-visible,
.latest-post a:hover,
.latest-post a:focus-visible {
	color: var(--color-accent-hover);
}
.category-card p {
	margin: 0;
	font-size: 0.92rem;
}
.latest-post {
	border-top: 1px solid var(--color-border);
	padding-top: 0.7rem;
	color: var(--color-text-muted);
}
.latest-post a {
	color: var(--color-link);
	font-weight: 700;
	overflow-wrap: anywhere;
}
.rss-cta {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto;
	gap: 1rem;
	align-items: center;
}
.rss-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border: 1px solid var(--color-accent);
	border-radius: 50%;
	background: var(--color-accent-muted);
	color: var(--color-accent-hover);
}
.rss-cta h2 {
	margin: 0 0 0.25rem;
	font-size: 1.25rem;
}
.rss-cta p {
	margin: 0;
	color: var(--color-text-muted);
	font-size: 0.95rem;
}
@media (min-width: 768px) {
	.latest-list {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
@media (max-width: 900px) {
	.hero,
	.direction-grid,
	.rss-cta {
		grid-template-columns: 1fr;
	}
	.hero {
		align-items: start;
	}
	.hero h1 {
		font-size: 2.25rem;
	}
	.rss-cta-button {
		width: fit-content;
	}
}
@media (max-width: 520px) {
	.hero-title-row {
		align-items: flex-start;
	}
	.hero-avatar {
		width: 56px;
		height: 56px;
	}
	.hero h1 {
		font-size: 2rem;
	}
	.primary-cta,
	.rss-cta-button {
		width: 100%;
	}
}
@media (prefers-reduced-motion: reduce) {
	.primary-cta,
	.rss-cta-button,
	.category-card {
		transition: none;
	}
	.primary-cta:hover,
	.primary-cta:focus-visible,
	.rss-cta-button:hover,
	.rss-cta-button:focus-visible,
	.category-card:hover {
		transform: none;
	}
}
```

- [ ] **Step 6: Run build after homepage change**

Run:

```bash
npm run build
```

Expected: build passes and `/index.html` is generated.

---

### Task 4: Move Devlog Navigation And Site Note Into Footer

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Remove devlog from primary nav**

In `src/components/Header.astro`, remove this line:

```astro
<HeaderLink href="/devlog">开发日志</HeaderLink>
```

Expected: primary navigation contains only `首页`, `文章`, `分类`, and `关于`, followed by `ThemeToggle`.

- [ ] **Step 2: Replace footer markup**

Replace the current `src/components/Footer.astro` markup and frontmatter with:

```astro
---
import { SITE_TITLE, SITE_URL } from '../consts';

const today = new Date();
---

<footer>
	<div class="footer-inner">
		<section class="footer-note" aria-labelledby="footer-note-title">
			<h2 id="footer-note-title">站点说明</h2>
			<p>
				{SITE_URL} 当前是静态优先的个人博客，不使用 WordPress、不接入数据库、不引入复杂 CMS。
				内容文件保存在仓库中，所有变更都可以通过 Git diff 审阅。
			</p>
			<p>
				<a href="/rss.xml">RSS</a> 可用于订阅更新，<a href="/sitemap-index.xml">sitemap</a>
				用于帮助搜索引擎发现公开页面。
			</p>
		</section>

		<nav class="footer-nav" aria-label="页脚导航">
			<a href="/blog">文章</a>
			<a href="/categories">分类</a>
			<a href="/about">关于</a>
			<a class="footer-devlog-link" href="/devlog">
				<span>开发日志</span>
				<small>记录博客本身的搭建与迭代过程</small>
			</a>
			<a href="/rss.xml">RSS</a>
			<a href="/sitemap-index.xml">Sitemap</a>
		</nav>

		<div class="footer-meta">
			<p>&copy; {today.getFullYear()} Chogori Lee. All rights reserved.</p>
			<p>
				<a href={SITE_URL}>{SITE_TITLE}</a> / 个人技术博客
			</p>
		</div>
	</div>
</footer>
```

- [ ] **Step 3: Replace footer styles**

Replace the current footer `<style>` block with:

```css
footer {
	padding: 2.5em 1em 6em;
	background: linear-gradient(var(--gray-gradient)) no-repeat;
	color: var(--color-text-muted);
}
.footer-inner {
	display: grid;
	gap: 1.5rem;
	max-width: 1080px;
	margin: 0 auto;
}
.footer-note {
	border: 1px solid var(--color-card-border);
	border-radius: 8px;
	background: var(--surface-soft);
	padding: 1rem;
	text-align: left;
}
.footer-note h2 {
	margin: 0 0 0.65rem;
	color: var(--color-text);
	font-size: 1.15rem;
}
.footer-note p {
	margin: 0.45rem 0;
	font-size: 0.95rem;
}
.footer-nav {
	display: flex;
	flex-wrap: wrap;
	gap: 0.65rem 1rem;
	align-items: center;
}
.footer-nav a {
	color: var(--color-link);
	font-weight: 700;
	text-decoration: none;
}
.footer-devlog-link {
	display: inline-grid;
	gap: 0.1rem;
}
.footer-devlog-link small {
	color: var(--color-text-muted);
	font-size: 0.78rem;
	font-weight: 400;
}
.footer-meta {
	display: grid;
	gap: 0.25rem;
	border-top: 1px solid var(--color-border);
	padding-top: 1rem;
	text-align: left;
}
footer p {
	margin: 0;
}
footer a {
	color: var(--color-link);
	text-decoration: none;
}
footer a:hover,
footer a:focus-visible {
	color: var(--color-link-hover);
}
@media (max-width: 720px) {
	.footer-nav {
		align-items: flex-start;
		flex-direction: column;
	}
}
```

- [ ] **Step 4: Run build after header/footer change**

Run:

```bash
npm run build
```

Expected: build passes and `/devlog/index.html`, `/rss.xml`, and `/sitemap-index.xml` remain generated.

---

### Task 5: Add Theme Toggle Tooltip

**Files:**
- Modify: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Add the static title attribute**

Replace the opening button tag with:

```astro
<button
	id="theme-toggle"
	type="button"
	aria-label="切换深色模式"
	aria-pressed="false"
	title="切换深色/浅色主题"
>
```

- [ ] **Step 2: Keep title synchronized in script**

Inside `syncThemeIcon`, after the existing `btn.setAttribute('aria-label', ...)` line, add:

```ts
btn.setAttribute('title', '切换深色/浅色主题');
```

Expected: the tooltip remains generic and stable while `aria-label` continues to describe the next action.

- [ ] **Step 3: Run build after theme toggle change**

Run:

```bash
npm run build
```

Expected: build passes with no client script type errors.

---

### Task 6: Update Development Log

**Files:**
- Modify through command: `src/data/devlog.json`

- [ ] **Step 1: Add the required devlog entry**

Run:

```bash
npm run devlog:add -- --type style --title "优化首页视觉层级" --description "调整首页 hero、文章卡片、技术方向、RSS CTA 与页脚信息结构。" --tags "homepage,ui,footer"
```

Expected: command appends one `style` entry to `src/data/devlog.json` unless the same title already exists.

- [ ] **Step 2: Confirm latest devlog output**

Run:

```bash
npm run devlog:latest
```

Expected: output includes `优化首页视觉层级` in the newest entries.

- [ ] **Step 3: Run build after devlog update**

Run:

```bash
npm run build
```

Expected: build passes and `/devlog/index.html` reflects the generated static devlog page.

---

### Task 7: Browser Verification

**Files:**
- No edits.

- [ ] **Step 1: Start the local dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Astro prints a local URL, usually `http://127.0.0.1:4321/`. If port 4321 is occupied, use the URL Astro prints.

- [ ] **Step 2: Verify homepage desktop**

Open the dev server homepage in the in-app browser at desktop width.

Expected:

- Hero has one intro column with inline avatar beside `Chogori Blog`.
- Right hero card contains `查看所有文章 →` linking to `/blog` and a subtle `RSS 订阅` link to `/rss.xml`.
- There is no separate `个人简介` card.
- Latest post covers are category gradients with centered labels.
- `技术方向` cards show large counts and latest-post links.
- RSS CTA strip appears where `站点说明` used to be.
- Footer contains `站点说明`, footer links, and `开发日志` with `记录博客本身的搭建与迭代过程`.

- [ ] **Step 3: Verify homepage mobile**

Set the browser viewport to mobile width around `390px`.

Expected:

- Hero collapses to one column.
- Latest articles remain one column.
- CTA buttons and card text do not overflow or overlap.
- Direction cards become one column below `900px`.

- [ ] **Step 4: Verify article list and category page**

Open:

```text
/blog
/categories/network-proxy/
```

Expected:

- Shared `PostCard` gradient covers render consistently.
- Cards still link to article detail pages under `/blog/${post.id}/`.
- Article grid is one column on mobile and two columns on desktop.

- [ ] **Step 5: Verify theme toggle title**

Inspect or hover the theme toggle button.

Expected: button has `title="切换深色/浅色主题"` and theme switching still works.

---

### Task 8: Final Verification And Commit

**Files:**
- Modified: `src/pages/index.astro`
- Modified: `src/components/PostCard.astro`
- Modified: `src/components/Header.astro`
- Modified: `src/components/Footer.astro`
- Modified: `src/components/ThemeToggle.astro`
- Modified: `src/data/devlog.json`

- [ ] **Step 1: Run final build**

Run:

```bash
npm run build
```

Expected: build passes with `Complete!`.

- [ ] **Step 2: Check working tree**

Run:

```bash
git status --short
```

Expected tracked changes only:

```text
 M src/components/Footer.astro
 M src/components/Header.astro
 M src/components/PostCard.astro
 M src/components/ThemeToggle.astro
 M src/data/devlog.json
 M src/pages/index.astro
?? .superpowers/
```

Do not stage `.superpowers/`, `dist/`, `.vercel/`, `node_modules/`, or unrelated files.

- [ ] **Step 3: Review diff**

Run:

```bash
git diff -- src/pages/index.astro src/components/PostCard.astro src/components/Header.astro src/components/Footer.astro src/components/ThemeToggle.astro src/data/devlog.json
```

Expected:

- No content `.md` or `.mdx` files changed.
- No route files added.
- CTA link uses `/blog`, not `/articles`.
- Footer contains the moved site-note text.
- `开发日志` appears in footer only.
- `PostCard.astro` contains category gradient covers.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add src/pages/index.astro src/components/PostCard.astro src/components/Header.astro src/components/Footer.astro src/components/ThemeToggle.astro src/data/devlog.json
git commit -m "style: optimize homepage visual hierarchy"
```

Expected: one implementation commit is created and `.superpowers/` remains untracked.

---

## Self-Review

- Spec coverage: hero merge, article-card gradients, hover transform, two-line excerpts, technical direction counts/latest links, nav/footer move, RSS CTA, theme toggle title, and mobile single-column behavior each have a task.
- Red-flag scan: no unresolved planning terms or unspecified code steps remain.
- Type consistency: all snippets use existing Astro collection fields `post.data.title`, `post.data.description`, `post.data.category`, `post.data.pubDate`, and `post.id`.
- Routing consistency: the plan intentionally links the all-articles CTA to existing `/blog` and does not create `/articles`.
- Safety: no Markdown/MDX content, deployment config, environment file, `.vercel`, `dist`, or `.superpowers/` changes are staged.
