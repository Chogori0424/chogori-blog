# Homepage Visual Optimization Design

## Goal

Improve the Chogori Blog homepage visual hierarchy, reduce repeated intro content, standardize article cards, make category direction cards more informative, and move secondary site metadata out of the main reading flow.

This spec is design-only. It defines the approved homepage direction before implementation and does not change source components, pages, styles, content, or routes.

## Current Context

The active project root is `C:\Users\16354\Documents\chogori-blog`.

Relevant files:

- `src/pages/index.astro` renders the homepage hero, latest posts, technical directions, and the current `站点说明` block.
- `src/components/PostCard.astro` renders shared article cards for the homepage and article-list pages.
- `src/components/Header.astro` renders the primary navigation, including the current `开发日志` link.
- `src/components/Footer.astro` renders the current minimal footer.
- `src/components/ThemeToggle.astro` renders the theme toggle icon button.
- `src/consts.ts` defines site identity, author data, and `BLOG_CATEGORIES`.
- `src/content/blog/*.{md,mdx}` provides static article frontmatter consumed through `getCollection('blog')`.

The existing all-articles route is `/blog`, not `/articles`. The user requested a CTA conceptually labeled `查看所有文章 →` and mentioned `/articles`, but the implementation must preserve the current route structure. Therefore the CTA should link to `/blog`.

## Selected Approach

Implement the approved visual direction A, the balanced homepage:

- Keep the homepage recognizably blog-first rather than turning it into a landing page.
- Make the hero left side the single source of author introduction.
- Replace the duplicated right-side `个人简介` card with a compact CTA block.
- Keep article cards in a two-column desktop grid and one-column mobile grid.
- Move secondary site explanation and development-log navigation into the footer.
- Use existing CSS variables and page/component-scoped CSS instead of new theme tokens or dependencies.

This approach is preferred because it improves clarity with contained component and layout edits, while respecting the static Astro architecture and current route/content model.

## Hero Design

The homepage hero should remain a two-column grid on desktop and collapse to one column on narrow screens.

Left column:

- Keep the existing kicker `chogori.xyz / 个人技术博客`.
- Show `SITE_TITLE` as the main heading.
- Move the avatar inline next to the title area, using `AUTHOR_AVATAR` and `AUTHOR_NAME`.
- Keep the current short introduction text as the only personal intro in the hero.
- Keep the existing profile tags, using current accent-muted chip styling.

Right column:

- Remove the separate `个人简介` card entirely.
- Add a single CTA block with the same restrained card language as the rest of the site.
- Include a primary link styled as a button: `查看所有文章 →`, linking to `/blog`.
- Include a subtle RSS link: `RSS 订阅`, linking to `/rss.xml`.
- Avoid repeating the author bio or implementation-stack details in this block.

Responsive behavior:

- Desktop: left intro and right CTA sit side by side.
- Mobile: the CTA follows the intro and keeps compact spacing.
- The avatar should not create layout shifts or crowd the heading on mobile.

## Article Card Design

`src/components/PostCard.astro` should standardize all article card covers as gradient category blocks instead of rendering mixed real images, placeholders, and screenshots.

Cover behavior:

- Always render a 16:9 gradient block.
- Overlay the post category label in the center.
- Use distinct gradient schemes per category:
  - `网络代理`: blue to teal
  - `工程制造`: orange to amber
  - `音频设备`: slate to cyan
  - `个人日志`: pink to purple
- Use a neutral fallback gradient if a future category appears unexpectedly.
- Do not render `heroImage` in card covers, but do not remove the `heroImage` frontmatter from content.

Card interaction:

- Add hover motion to the whole card:
  - `transform: translateY(-4px);`
  - `transition: transform 0.2s ease;`
- Preserve a reduced-motion fallback that disables transform for users who prefer reduced motion.
- Keep existing border/background hover behavior if it remains visually compatible.

Excerpt stability:

- Keep excerpt text clamped to two lines:
  - `display: -webkit-box;`
  - `-webkit-line-clamp: 2;`
  - `-webkit-box-orient: vertical;`
  - `overflow: hidden;`
- Keep the title clamped to two lines as it is today.
- Preserve consistent card height through flex layout and `margin-top: auto` on the read-more affordance.

Grid behavior:

- Homepage latest posts and `/blog` article grid should be single column below the tablet breakpoint.
- Use two columns from the existing `768px` breakpoint and up.
- Do not introduce Tailwind classes because the project uses ordinary Astro-scoped CSS.

## Technical Directions Design

The homepage `技术方向` section should reuse the existing `BLOG_CATEGORIES` data and augment each category with count and latest post.

For each category card:

- Display the article count as a prominent number at the top:
  - approximately `2.5rem`
  - bold weight
  - tight line height
- Show the category name below or beside the number with clear hierarchy.
- Keep the category description.
- Add a `最新：{article title}` line below the description.
- Link the latest article title directly to `/blog/${post.id}/`.
- If a category has no posts, show a quiet fallback such as `最新：待整理`.

Data flow:

- `src/pages/index.astro` should derive category post lists from `getCollection('blog')`.
- Categories remain ordered by `BLOG_CATEGORIES`.
- Latest post per category is selected by descending `pubDate`.
- No client-side data fetching is introduced.

## Navigation And Footer Design

Primary navigation should be simplified for first-time visitors:

- Keep `首页`, `文章`, `分类`, and `关于` in the primary navigation.
- Remove `开发日志` from the primary nav.
- Move `开发日志` into footer navigation.
- Add the sub-label near the footer link: `记录博客本身的搭建与迭代过程`.

This resolves the requested distinction between `文章` and `开发日志` without making the header taller or harder to scan on mobile.

Footer should become the home for secondary site metadata:

- Keep copyright and site identity.
- Add footer nav links:
  - `文章` -> `/blog`
  - `分类` -> `/categories`
  - `关于` -> `/about`
  - `开发日志` -> `/devlog`
  - `RSS` -> `/rss.xml`
  - `Sitemap` -> `/sitemap-index.xml`
- Move the current `站点说明` copy from homepage main content into the footer.
- Keep the footer visually quiet and consistent with `var(--surface-soft)`, `var(--color-card-border)`, and existing text variables.

## RSS CTA Strip Design

Replace the homepage main-content `站点说明` section with a full-width CTA strip.

CTA strip content:

- Text: `订阅 RSS，获取最新文章更新`
- Include a simple RSS icon rendered inline in Astro markup.
- Include a subscribe button linking to `/rss.xml`.
- Use subtle background and border styling consistent with existing cards.
- Keep it visually lighter than the hero CTA and lower priority than articles.

The CTA strip should sit after `技术方向`, where the old `站点说明` block currently interrupts the main content flow.

## Theme Toggle Design

`src/components/ThemeToggle.astro` should add a `title` attribute to the theme toggle button.

Behavior:

- Initial title: `切换深色/浅色主题`
- The existing `aria-label` and `aria-pressed` behavior can continue to update based on active theme.
- The static `title` can remain generic unless implementation chooses to update it alongside `aria-label`.

This is a small accessibility and discoverability improvement and should not change theme switching behavior.

## Styling Constraints

Implementation must preserve the existing dark-theme CSS variable system:

- Do not replace the current color-token architecture.
- Do not introduce a new design-token layer unless strictly needed.
- Prefer `var(--color-*)`, `var(--surface)`, and `var(--surface-soft)`.
- Hard-coded gradient stops are acceptable inside `PostCard.astro` because they are category artwork rather than theme tokens.
- Do not add Tailwind CSS or a UI framework.
- Do not use client-side data fetching.

## Content And Routing Constraints

Do not change Markdown or MDX article content.

Do not modify content frontmatter unless a build failure reveals an invalid date. Current homepage work should not require any content file edits.

Do not change routing structure:

- Keep article detail routes as `/blog/${post.id}/`.
- Keep all-articles route as `/blog`.
- Do not add a new `/articles` route or redirect as part of this work.

Do not modify Cloudflare, Vercel, GitHub OAuth, Decap CMS, `.vercel`, deployment settings, or environment files.

## Error Handling

The homepage and card components should behave defensively:

- Unknown category uses a neutral fallback gradient.
- Missing category should not render undefined visible text.
- Missing latest post should render `最新：待整理` without a broken link.
- Invalid or missing dates should not break static rendering.
- RSS and footer links should remain normal static anchors.

The content schema still requires title, description, category, and `pubDate`, so these guards mainly protect against future schema evolution.

## Verification Plan

After implementation:

1. Run `npm run build`.
2. Run `npm run devlog:add -- --type style --title "优化首页视觉层级" --description "调整首页 hero、文章卡片、技术方向、RSS CTA 与页脚信息结构。" --tags "homepage,ui,footer"`.
3. Run `npm run devlog:latest` to confirm the development log entry.
4. Start the Astro dev server.
5. Visually verify `/` at desktop width:
   - hero no longer duplicates intro content
   - avatar appears inline with the title area
   - CTA links to `/blog` and RSS link points to `/rss.xml`
   - latest article covers are category gradients
   - technology cards show large counts and latest post links
   - RSS CTA strip replaces the old site-note block
   - footer contains site explanation and devlog link with explanatory copy
6. Visually verify `/` at mobile width:
   - article grid is one column
   - hero columns collapse cleanly
   - text does not overlap or overflow buttons/cards
7. Check `/blog` and one category page to confirm shared article cards still render consistently.
8. Confirm `ThemeToggle.astro` button has the expected `title` attribute.
9. Check `git status` before committing so `.superpowers/`, `dist`, `.vercel`, and unrelated files are not included.

## Non-Goals

- Do not redesign article detail pages.
- Do not change RSS generation.
- Do not change sitemap generation.
- Do not change the category taxonomy.
- Do not remove `heroImage` from article frontmatter.
- Do not introduce search, tags, filtering, pagination, or analytics.
- Do not make a marketing landing page.

## Self-Review

- No placeholders or unresolved decisions remain.
- The `/articles` versus `/blog` conflict is resolved in favor of the existing `/blog` route because routing must not change.
- The selected design matches visual option A approved by the user.
- The spec covers all requested areas: hero, article cards, technical directions, navigation, site-note relocation, RSS CTA, theme toggle tooltip, and mobile grid behavior.
- The implementation scope is limited to layout/component files plus the required devlog entry.
