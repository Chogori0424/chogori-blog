# Post Card Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one shared Astro post-card component and use it for every article-list surface: homepage Latest Posts, `/blog`, and `/categories/[slug]`.

**Architecture:** Keep post querying and sorting inside existing pages. Move card rendering, cover fallback, date formatting, line clamping, and card interaction styling into `src/components/PostCard.astro`, then reduce each page to a simple responsive grid of `<PostCard post={post} />`.

**Tech Stack:** Astro 6 content collections, Astro assets `Image`, Markdown/MDX blog entries, plain component-scoped CSS, page-scoped CSS grids, npm build verification.

---

## File Structure

- Create: `src/components/PostCard.astro`
  - Owns article-card markup, defensive field normalization, cover rendering, fallback cover, title/excerpt clamps, quiet metadata, and read-more footer.
- Modify: `src/pages/index.astro`
  - Imports `PostCard`, removes duplicated Latest Posts card markup and CSS, keeps the latest-four query and homepage section structure.
- Modify: `src/pages/blog/index.astro`
  - Imports `PostCard`, removes duplicated full article card markup and CSS, keeps page heading and category navigation.
- Modify: `src/pages/categories/[slug].astro`
  - Imports `PostCard`, removes duplicated category article card markup and CSS, keeps category heading and empty-state behavior.
- Modify: `src/data/devlog.json`
  - Records the style/component refactor through `npm run devlog:add`.
- Do not modify:
  - `src/content/blog/**`
  - `src/pages/blog/[...slug].astro`
  - `src/layouts/BlogPost.astro`
  - `src/pages/categories/index.astro`
  - `src/styles/global.css`
  - Vercel, Cloudflare, GitHub OAuth, Decap CMS, or deployment configuration
  - `.superpowers/` visual-companion output

---

### Task 1: Create Shared PostCard Component

**Files:**
- Create: `src/components/PostCard.astro`

- [ ] **Step 1: Confirm there is no existing shared article-card component**

Run:

```bash
rg --files src/components | rg "(PostCard|ArticleCard|BlogCard|LatestPosts|HomeLatestPosts)"
```

Expected:

- No output for a shared post-card component in the current codebase.
- Continue with creating `src/components/PostCard.astro`.

- [ ] **Step 2: Add `src/components/PostCard.astro`**

Create `src/components/PostCard.astro` with this complete content:

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
	post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;

const title = post?.data?.title || 'Untitled';
const description = post?.data?.description?.trim();
const category = post?.data?.category;
const image = post?.data?.heroImage;
const href = `/blog/${post.id}/`;
const dateValue = post?.data?.pubDate;
const date = dateValue instanceof Date ? dateValue : dateValue ? new Date(dateValue) : null;
const formattedDate = date && !Number.isNaN(date.valueOf()) ? date.toISOString().slice(0, 10) : '';
const hasMeta = Boolean(category || formattedDate);
---

<article class="post-card">
	<a class="post-card-cover" href={href} aria-label={title}>
		{
			image ? (
				<Image
					width={720}
					height={405}
					src={image}
					alt={title}
					loading="lazy"
					class="post-card-image"
				/>
			) : (
				<div class="post-card-fallback" aria-hidden="true">
					<span>Chogori Blog</span>
				</div>
			)
		}
	</a>

	<div class="post-card-content">
		{
			hasMeta && (
				<div class="post-card-meta">
					{category && <span class="post-card-category">{category}</span>}
					{formattedDate && (
						<time datetime={formattedDate} class="post-card-date">
							{formattedDate}
						</time>
					)}
				</div>
			)
		}

		<h3 class="post-card-title">
			<a href={href}>{title}</a>
		</h3>

		{
			description && (
				<p class="post-card-excerpt">
					{description}
				</p>
			)
		}

		<a class="post-card-more" href={href} aria-label={`阅读全文：${title}`}>
			阅读全文 →
		</a>
	</div>
</article>

<style>
	.post-card {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--color-card-border) 78%, transparent);
		border-radius: 12px;
		background: color-mix(in srgb, var(--surface) 88%, var(--color-bg-secondary));
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.post-card:hover {
		border-color: color-mix(in srgb, var(--color-accent) 55%, var(--color-card-border));
		background: color-mix(in srgb, var(--surface) 72%, var(--color-bg-hover));
	}

	.post-card-cover {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #18181b;
		color: inherit;
		text-decoration: none;
	}

	.post-card-image {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 0;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.post-card:hover .post-card-image {
		transform: scale(1.03);
	}

	.post-card-fallback {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		background:
			linear-gradient(135deg, rgba(8, 51, 68, 0.95), rgba(24, 24, 27, 0.98) 54%, rgba(23, 37, 84, 0.95));
	}

	.post-card-fallback span {
		color: color-mix(in srgb, var(--color-accent-hover) 62%, transparent);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.post-card-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 1.25rem;
	}

	.post-card-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		color: var(--color-text-muted);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.post-card-category {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.post-card-date {
		flex-shrink: 0;
	}

	.post-card-title {
		margin: 0.75rem 0 0;
		color: var(--color-text);
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.35;
	}

	.post-card-title a {
		color: inherit;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.post-card-title a:hover,
	.post-card-title a:focus-visible {
		color: var(--color-accent-hover);
	}

	.post-card-title,
	.post-card-excerpt {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
	}

	.post-card-title {
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.post-card-excerpt {
		margin: 0.75rem 0 0;
		color: var(--color-text-muted);
		font-size: 0.92rem;
		line-height: 1.65;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.post-card-more {
		margin-top: auto;
		padding-top: 1.25rem;
		color: color-mix(in srgb, var(--color-accent-hover) 82%, var(--color-text));
		font-size: 0.92rem;
		font-weight: 700;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.post-card-more:hover,
	.post-card-more:focus-visible {
		color: var(--color-accent-hover);
	}

	@media (prefers-reduced-motion: reduce) {
		.post-card,
		.post-card-image,
		.post-card-title a,
		.post-card-more {
			transition: none;
		}

		.post-card:hover .post-card-image {
			transform: none;
		}
	}
</style>
```

- [ ] **Step 3: Run a focused build check for the new component**

Run:

```bash
npm run build
```

Expected:

- Build can fail only if the new component has a type, syntax, or Astro assets error.
- If it fails, fix `src/components/PostCard.astro` before touching page files.

---

### Task 2: Refactor Homepage Latest Posts

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update imports**

In `src/pages/index.astro`, remove:

```astro
import { Image } from 'astro:assets';
import FormattedDate from '../components/FormattedDate.astro';
```

Add:

```astro
import PostCard from '../components/PostCard.astro';
```

Expected import group:

```astro
---
import { getCollection } from 'astro:content';
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import PostCard from '../components/PostCard.astro';
import {
	AUTHOR_AVATAR,
	AUTHOR_NAME,
	BLOG_CATEGORIES,
	SITE_DESCRIPTION,
	SITE_TITLE,
	SITE_URL,
} from '../consts';
```

- [ ] **Step 2: Replace Latest Posts list CSS**

In the `<style>` block, replace the `.latest-list` rule with:

```css
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
```

Delete these old homepage-only card rules from `src/pages/index.astro`:

```css
			.post-card {
				overflow: hidden;
				height: 100%;
				border: 1px solid var(--color-card-border);
				border-radius: 8px;
				background: var(--surface);
				transition:
					background-color 0.3s ease,
					border-color 0.3s ease,
					color 0.3s ease;
			}
			.post-card a {
				display: grid;
				grid-template-columns: 180px minmax(0, 1fr);
				height: 100%;
				color: var(--color-text);
				text-decoration: none;
			}
			.post-card img {
				width: 100%;
				height: 100%;
				min-height: 180px;
				object-fit: cover;
				border-radius: 0;
			}
			.post-body {
				padding: 1rem;
			}
			.post-meta {
				display: flex;
				flex-wrap: wrap;
				gap: 0.45rem;
				align-items: center;
				margin-bottom: 0.65rem;
				color: var(--color-text-muted);
				font-size: 0.82rem;
			}
			.post-body h3 {
				margin: 0 0 0.55rem;
				font-size: 1.15rem;
			}
			.post-body p {
				margin: 0;
				font-size: 0.95rem;
			}
```

In the shared pill selector, remove `.post-category` so the selector becomes:

```css
			.profile-meta span,
			.category-card span:first-of-type {
```

In the hover selector, remove `.post-card:hover` so it becomes:

```css
			.category-card:hover {
				border-color: var(--color-accent);
			}
```

Add this desktop grid rule before the existing `@media (max-width: 900px)` block:

```css
			@media (min-width: 768px) {
				.latest-list {
					grid-template-columns: repeat(2, minmax(0, 1fr));
				}
			}
```

Inside the existing `@media (max-width: 900px)` block, change:

```css
				.hero,
				.latest-list,
				.direction-grid {
					grid-template-columns: 1fr;
				}
```

to:

```css
				.hero,
				.direction-grid {
					grid-template-columns: 1fr;
				}
```

Delete these old mobile card rules from the same media block:

```css
				.post-card a {
					grid-template-columns: 1fr;
				}
				.post-card img {
					height: auto;
					min-height: 0;
				}
```

- [ ] **Step 3: Replace Latest Posts markup**

Replace the existing `<ul class="latest-list">...</ul>` map body with:

```astro
				<ul class="latest-list">
					{latestPosts.map((post) => <li><PostCard post={post} /></li>)}
				</ul>
```

- [ ] **Step 4: Verify homepage no longer owns article-card internals**

Run:

```bash
rg -n "Image|FormattedDate|post-card|post-body|post-meta|post-category" src/pages/index.astro
```

Expected:

- No matches for `Image`, `FormattedDate`, `post-card`, `post-body`, `post-meta`, or `post-category`.
- `latest-list` still exists.

---

### Task 3: Refactor Blog Index

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Update imports**

Remove:

```astro
import { Image } from 'astro:assets';
import FormattedDate from '../../components/FormattedDate.astro';
```

Add:

```astro
import PostCard from '../../components/PostCard.astro';
```

Expected import group:

```astro
---
import { getCollection } from 'astro:content';
import BaseHead from '../../components/BaseHead.astro';
import Footer from '../../components/Footer.astro';
import Header from '../../components/Header.astro';
import PostCard from '../../components/PostCard.astro';
import { BLOG_CATEGORIES, SITE_DESCRIPTION, SITE_TITLE } from '../../consts';
```

- [ ] **Step 2: Replace blog grid CSS**

In the `<style>` block, replace `.post-grid` with:

```css
			.post-grid {
				display: grid;
				grid-template-columns: 1fr;
				gap: 1.5rem;
				align-items: stretch;
				list-style: none;
				margin: 0;
				padding: 0;
			}
			.post-grid > li {
				min-width: 0;
				height: 100%;
			}
```

Delete these old blog-index card rules:

```css
			.post-card {
				overflow: hidden;
				height: 100%;
				border: 1px solid var(--color-card-border);
				border-radius: 8px;
				background: var(--surface);
				transition:
					background-color 0.3s ease,
					border-color 0.3s ease,
					color 0.3s ease;
			}
			.post-card a {
				display: grid;
				height: 100%;
				color: var(--color-text);
				text-decoration: none;
			}
			.post-card img {
				display: block;
				width: 100%;
				border-radius: 0;
			}
			.post-body {
				padding: 1rem;
			}
			.meta {
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
				align-items: center;
				margin-bottom: 0.75rem;
				color: var(--color-text-muted);
				font-size: 0.85rem;
			}
			.badge {
				display: inline-flex;
				border: 1px solid var(--color-accent);
				border-radius: 999px;
				padding: 0.15rem 0.55rem;
				background: var(--color-accent-muted);
				color: var(--color-text);
				font-weight: 700;
			}
			.post-card:hover {
				border-color: var(--color-accent);
			}
			.post-body h2 {
				margin: 0 0 0.55rem;
				font-size: 1.35rem;
			}
			.post-body p {
				margin: 0;
			}
```

Replace the old mobile-only grid media block:

```css
			@media (max-width: 760px) {
				.post-grid {
					grid-template-columns: 1fr;
				}
			}
```

with:

```css
			@media (min-width: 768px) {
				.post-grid {
					grid-template-columns: repeat(2, minmax(0, 1fr));
				}
			}
```

- [ ] **Step 3: Replace blog index markup**

Replace the existing `<ul class="post-grid">...</ul>` map body with:

```astro
			<ul class="post-grid">
				{posts.map((post) => <li><PostCard post={post} /></li>)}
			</ul>
```

- [ ] **Step 4: Verify blog index no longer owns article-card internals**

Run:

```bash
rg -n "Image|FormattedDate|post-card|post-body|meta|badge|heroImage" src/pages/blog/index.astro
```

Expected:

- No matches for `Image`, `FormattedDate`, `post-card`, `post-body`, `badge`, or `heroImage`.
- The string `meta` should not appear as a CSS class for article cards.
- `post-grid` still exists.

---

### Task 4: Refactor Category Detail Article Lists

**Files:**
- Modify: `src/pages/categories/[slug].astro`

- [ ] **Step 1: Update imports**

Remove:

```astro
import { Image } from 'astro:assets';
import FormattedDate from '../../components/FormattedDate.astro';
```

Add:

```astro
import PostCard from '../../components/PostCard.astro';
```

Expected import group:

```astro
---
import { getCollection } from 'astro:content';
import BaseHead from '../../components/BaseHead.astro';
import Footer from '../../components/Footer.astro';
import Header from '../../components/Header.astro';
import PostCard from '../../components/PostCard.astro';
import { BLOG_CATEGORIES, SITE_TITLE } from '../../consts';
```

- [ ] **Step 2: Replace category post-list CSS**

Replace `.post-list` with:

```css
			.post-list {
				display: grid;
				grid-template-columns: 1fr;
				gap: 1.5rem;
				align-items: stretch;
				list-style: none;
				margin: 0;
				padding: 0;
			}
			.post-list > li {
				min-width: 0;
				height: 100%;
			}
```

Delete these old category article-card rules:

```css
			.post-card {
				overflow: hidden;
				border: 1px solid var(--color-card-border);
				border-radius: 8px;
				background: var(--surface);
				transition:
					background-color 0.3s ease,
					border-color 0.3s ease,
					color 0.3s ease;
			}
			.post-card a {
				display: grid;
				grid-template-columns: 240px minmax(0, 1fr);
				gap: 1rem;
				color: var(--color-text);
				text-decoration: none;
			}
			.post-card img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 0;
			}
			.post-body {
				padding: 1rem 1rem 1rem 0;
			}
			.date {
				margin: 0 0 0.4rem;
				color: var(--color-text-muted);
				font-size: 0.85rem;
			}
			.post-body h2 {
				margin: 0 0 0.5rem;
				font-size: 1.25rem;
			}
			.post-body p {
				margin: 0;
			}
```

Replace:

```css
			.post-card:hover,
			.empty {
				border-color: var(--color-accent);
			}
```

with:

```css
			.empty {
				border-color: var(--color-accent);
			}
```

Replace the old mobile card media block:

```css
			@media (max-width: 720px) {
				.post-card a {
					grid-template-columns: 1fr;
				}
				.post-body {
					padding: 1rem;
				}
				.post-card img {
					height: auto;
				}
			}
```

with:

```css
			@media (min-width: 768px) {
				.post-list {
					grid-template-columns: repeat(2, minmax(0, 1fr));
				}
			}
```

- [ ] **Step 3: Replace category detail markup**

Replace the current `posts.map` body inside `<ul class="post-list">` with:

```astro
						{posts.map((post) => <li><PostCard post={post} /></li>)}
```

The whole rendered branch should become:

```astro
				posts.length > 0 ? (
					<ul class="post-list">
						{posts.map((post) => <li><PostCard post={post} /></li>)}
					</ul>
				) : (
					<p class="empty">这个栏目还在整理中。</p>
				)
```

- [ ] **Step 4: Verify category detail no longer owns article-card internals**

Run:

```bash
rg -n "Image|FormattedDate|post-card|post-body|date|heroImage" "src/pages/categories/[slug].astro"
```

Expected:

- No matches for `Image`, `FormattedDate`, `post-card`, `post-body`, or `heroImage`.
- The string `date` should only appear if it is part of unrelated page logic; it should not remain as a category article-card CSS class.
- `post-list` still exists.

---

### Task 5: Update Development Log

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: Add the style/refactor devlog entry**

Run:

```bash
npm run devlog:add -- --type style --title "统一文章卡片布局" --description "新增 PostCard 组件并重构首页、文章页和分类详情页文章列表，统一 16:9 封面、无图占位、标题摘要截断和卡片高度。"
```

Expected:

- Output starts with `Added changelog item:`.
- If the same title already exists from a retry, output starts with `Skipped duplicate changelog item:` and no manual edit is needed.

- [ ] **Step 2: Confirm latest devlog output**

Run:

```bash
npm run devlog:latest
```

Expected:

- The 2026-05-11 group includes the style entry for `统一文章卡片布局`.
- Existing 2026-05-11 Codex color-system style entry remains present.

---

### Task 6: Build and Visual Verification

**Files:**
- Verify: `src/components/PostCard.astro`
- Verify: `src/pages/index.astro`
- Verify: `src/pages/blog/index.astro`
- Verify: `src/pages/categories/[slug].astro`
- Verify: `src/data/devlog.json`

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected:

- Exit code `0`.
- Astro builds the homepage, blog index, blog detail pages, category pages, RSS, and sitemap without type, image, or route errors.

- [ ] **Step 2: Start local dev server for visual review**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

Expected:

- Output includes a local URL such as `http://127.0.0.1:4321/`.
- If port `4321` is already busy, rerun with `--port 4322` and use that URL for the checks below.

- [ ] **Step 3: Inspect the homepage**

Open:

```text
http://127.0.0.1:4321/
```

Expected at desktop width:

- Latest Posts renders as two columns.
- Same-row cards stretch to equal height.
- Covers are 16:9.
- Category/date metadata is quiet and not pill-styled.
- Titles clamp to two lines.
- Excerpts clamp to two lines.
- `阅读全文 →` aligns near the bottom of each card.

Expected at mobile width:

- Latest Posts renders as one column.
- Cards keep the 16:9 top cover and do not collapse.

- [ ] **Step 4: Inspect the blog index**

Open:

```text
http://127.0.0.1:4321/blog/
```

Expected:

- The article list uses the same two-column desktop and one-column mobile card layout as the homepage.
- Category navigation above the list still works.
- Clicking a cover, title, or read-more link opens `/blog/<post-id>/`.

- [ ] **Step 5: Inspect one category detail page**

Open:

```text
http://127.0.0.1:4321/categories/network-proxy/
```

Expected:

- The category article list uses the same `PostCard` layout.
- Empty-state behavior remains unchanged for categories with no posts if such a category is added later.
- The category overview page at `/categories/` still uses category cards and was not converted to post cards.

- [ ] **Step 6: Verify no duplicate page-local article-card CSS remains**

Run:

```bash
rg -n "post-card|post-body|post-meta|post-category|heroImage|FormattedDate|astro:assets" src/pages/index.astro src/pages/blog/index.astro "src/pages/categories/[slug].astro"
```

Expected:

- No output.
- `heroImage`, `FormattedDate`, and `astro:assets` are now owned by `PostCard.astro` or other unrelated files, not these three list pages.

---

### Task 7: Final Git Review and Commit

**Files:**
- Review: all modified implementation files

- [ ] **Step 1: Review working tree**

Run:

```bash
git status --short
```

Expected tracked changes:

- `src/components/PostCard.astro`
- `src/pages/index.astro`
- `src/pages/blog/index.astro`
- `src/pages/categories/[slug].astro`
- `src/data/devlog.json`

Expected additional untracked item:

- `.superpowers/` may still exist from the brainstorming visual companion and must not be added to the commit.

- [ ] **Step 2: Review implementation diff**

Run:

```bash
git diff -- src/components/PostCard.astro src/pages/index.astro src/pages/blog/index.astro "src/pages/categories/[slug].astro" src/data/devlog.json
```

Expected:

- `PostCard.astro` contains the shared component.
- The three page files contain only list grid CSS and `<PostCard post={post} />` mapping for article cards.
- No Markdown article content is changed.
- No service/deployment config is changed.

- [ ] **Step 3: Commit implementation only after build passes**

Run:

```bash
git add src/components/PostCard.astro src/pages/index.astro src/pages/blog/index.astro "src/pages/categories/[slug].astro" src/data/devlog.json
git commit -m "style: unify post card layouts"
```

Expected:

- Commit succeeds.
- `.superpowers/` remains untracked or ignored and is not included.

---

## Self-Review

- Spec coverage: the plan creates `PostCard.astro`, covers homepage Latest Posts, `/blog`, and `/categories/[slug]`, adds fallback covers, uses 16:9 media, clamps title and excerpt, quiets metadata, updates the devlog, runs build, and includes visual checks.
- Unresolved-token scan: there are no blocked decisions or unspecified implementation steps.
- Type consistency: the plan uses the actual content fields `title`, `description`, `category`, `pubDate`, `heroImage`, and `post.id`.
- Scope consistency: the plan avoids article detail pages, category overview cards, content Markdown, global color-system changes, and deployment configuration.
