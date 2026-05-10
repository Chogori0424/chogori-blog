# Post Card Unification Design

## Goal

Unify all article-list cards in Chogori Blog so the homepage Latest Posts section, the `/blog` index, and category detail pages render stable, consistent, dark-theme-friendly post cards.

The main problems to solve are uneven card heights, missing-cover layout collapse, inconsistent title and excerpt alignment, and overly prominent category/date metadata.

This spec is design-only. No source components, pages, styles, or content are changed by this document.

## Current Context

The project does not currently have a shared article card component. The same behavior is duplicated in:

- `src/pages/index.astro` for Latest Posts
- `src/pages/blog/index.astro` for the full article grid
- `src/pages/categories/[slug].astro` for category article lists

The project also does not use Tailwind CSS. It uses page-scoped Astro styles plus global CSS variables from `src/styles/global.css`. The implementation should therefore use ordinary CSS that matches the Tailwind-like structure requested by the user.

The existing blog content model uses these fields:

- `post.data.title`
- `post.data.description`
- `post.data.category`
- `post.data.pubDate`
- `post.data.tags`
- `post.data.heroImage`
- `post.id`

The existing article route is `/blog/${post.id}/`.

## Selected Approach

Create a shared `src/components/PostCard.astro` component and use it in every article list:

- Homepage Latest Posts
- `/blog` index
- `/categories/[slug]` detail pages

This is preferred because it creates one source of truth for card structure, fallback cover behavior, date formatting, clamping, hover states, and link routing. It also removes duplicate `.post-card`, `.post-body`, `.meta`, and image rules from page files.

## Component Design

`PostCard.astro` should accept a single `post` prop and derive display values defensively:

- `title`: use `post.data.title`, fallback to `Untitled`
- `description`: use `post.data.description`, render only if present
- `category`: use `post.data.category`, render only if present
- `date`: use `post.data.pubDate`, render only if it can be formatted
- `image`: use `post.data.heroImage`, render fallback if absent
- `href`: `/blog/${post.id}/`

The outer card should be a full-height flex column:

- `height: 100%`
- `display: flex`
- `flex-direction: column`
- `overflow: hidden`
- `border-radius: 12px`
- low-contrast border using `var(--color-card-border)`
- elevated dark surface using `var(--surface)` or a conservative `color-mix` with `var(--color-bg-secondary)`
- subtle hover border/background change using existing accent and surface variables

The cover area should always render:

- fixed `aspect-ratio: 16 / 9`
- `width: 100%`
- `overflow: hidden`
- dark base background
- real images use `object-fit: cover`
- real images use `loading="lazy"`
- image alt text uses the post title
- hover image scale is visual only and must not affect layout

If `heroImage` is absent, the fallback cover must render the same 16:9 box with a deep cyan/blue/zinc gradient and concise text such as `Chogori Blog`.

The content area should be a flexible column:

- `flex: 1`
- `display: flex`
- `flex-direction: column`
- consistent padding around `1.25rem`

Metadata should be quiet:

- category and date in a small, muted row
- no bright pill border for category inside `PostCard`
- category omitted if missing
- date omitted if missing or invalid
- date displayed as `YYYY-MM-DD`

Title and excerpt should be clamped:

- title max 2 lines
- excerpt max 2 lines
- both use CSS line clamp fallback via `display: -webkit-box`
- long content must not increase card height unpredictably

The footer should be optional but included for alignment and affordance:

- `margin-top: auto`
- text: `阅读全文 →`
- muted cyan/accent color
- hover color slightly stronger

## Page Layout Design

Each article-list page should use a simple grid wrapper around `PostCard`:

- one column on small screens
- two columns from `768px` and up
- `gap: 1.5rem`
- `align-items: stretch`
- list reset when using `<ul>`
- each `<li>` uses `height: 100%`

The homepage should keep the section title and limit to the latest four posts.

The `/blog` index should keep its page heading and category navigation, but replace inline article markup with `PostCard`.

The category detail page should keep its heading and empty-state behavior, but when posts exist it should render the same two-column card grid. The category overview page is not part of this refactor because it renders category cards, not article cards.

## Data Flow

The pages continue to fetch and sort posts with `getCollection('blog')`.

Each page passes each collection entry directly into the component:

```astro
<PostCard post={post} />
```

`PostCard.astro` owns display formatting for the card. Page files own only collection selection, sorting, headings, and list/grid layout.

## Error Handling

The component should avoid rendering invalid visible values:

- no `undefined` category
- no invalid date text
- no broken image icon when the post has no `heroImage`
- no empty excerpt paragraph when description is missing
- title falls back to `Untitled` only as a last-resort defensive display value

Because the content schema currently requires `title`, `description`, `category`, and `pubDate`, these guards are mainly to keep the component stable if the schema evolves later.

## Styling Constraints

Do not introduce Tailwind CSS or any new dependency.

Use component-scoped CSS in `PostCard.astro` for card internals and page-scoped CSS for list grids. If a clamp utility is needed, implement it inside component CSS instead of relying on Tailwind line-clamp.

Keep the style consistent with the existing dark technical blog theme:

- dark neutral surfaces
- subtle border contrast
- cyan/blue accent only for links, fallback cover text, and the read-more affordance
- no loud category pills inside article cards
- no excessive animation

## Non-Goals

- Do not change Markdown or MDX article content.
- Do not change article routes.
- Do not change article detail layout.
- Do not change category overview cards.
- Do not change the global color system beyond what the card component needs.
- Do not modify Cloudflare, Vercel, GitHub OAuth, Decap CMS, or deployment settings.
- Do not introduce Tailwind, React, or a UI component library.

## Verification Plan

After implementation:

1. Run `npm run build`.
2. Start the Astro dev server.
3. Check the homepage Latest Posts section at desktop and mobile widths.
4. Check `/blog` at desktop and mobile widths.
5. Check at least one `/categories/[slug]` page with posts.
6. Confirm same-row cards align in height on desktop.
7. Confirm no-cover posts still show a 16:9 fallback cover.
8. Confirm title and excerpt clamping prevents card overflow.
9. Confirm article detail pages still route correctly.
10. Update the development log with `npm run devlog:add` before the implementation commit.

## Self-Review

- No placeholders or unresolved decisions remain.
- The design uses the actual project fields: `pubDate`, `heroImage`, and `post.id`.
- The design covers homepage, `/blog`, and category detail article lists.
- The category overview and article detail pages are intentionally out of scope.
- The styling plan does not depend on Tailwind.
