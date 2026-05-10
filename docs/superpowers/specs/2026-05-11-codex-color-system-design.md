# Codex App Color System Design

## Goal

Update the blog color system so the site visually follows the current Codex app theme shown by the user. The change should apply to both light and dark modes, with dark mode treated as the primary target.

This spec is design-only. No source CSS, components, pages, or content are changed by this document.

## Source Palette

The user confirmed the current Codex app settings as the reference:

- Accent: `#339CFF`
- Light background: `#FFFFFF`
- Light foreground: `#1A1C1F`
- Dark background: `#181818`
- Dark foreground: `#FFFFFF`
- UI font: system UI stack beginning with `-apple-system, BlinkMacSystemFont`
- Code font: `ui-monospace`, `SFMono-Regular`, and local monospace fallbacks

The screenshot only exposes the primary accent, background, and foreground values. Secondary surfaces and borders should be derived conservatively from the same visual system instead of introducing unrelated hues.

## Selected Approach

Use the existing CSS variable system in `src/styles/global.css` and remap the variables to Codex app colors.

This is the preferred approach because the site already routes most page, card, code, link, tag, navigation, focus, and floating-widget styling through global variables. Updating the variable layer keeps the implementation small and reduces risk to page layout, Markdown rendering, Decap CMS, Vercel, Cloudflare, and GitHub OAuth configuration.

## Variable Mapping

### Shared Accent

Use Codex blue everywhere the site currently uses the accent color:

- `--color-accent: #339CFF`
- `--color-accent-hover`: a slightly brighter hover blue, derived from Codex blue
- `--color-accent-muted`: transparent Codex blue for selected text, tag backgrounds, focus rings, and subtle highlights
- `--color-link`: Codex blue
- `--color-link-hover`: brighter Codex blue

### Dark Mode

Dark mode should match the Codex app settings most closely:

- `--color-bg: #181818`
- `--color-text: #FFFFFF`
- `--color-bg-secondary`: derived dark surface around `#202020`
- `--color-card-bg`: derived elevated surface around `#242424`
- `--color-bg-hover`: derived hover surface around `#2A2A2A`
- `--color-border`: derived divider around `#343434`
- `--color-text-muted`: muted white around `rgba(255, 255, 255, 0.62)` or an equivalent solid value
- `--color-code-bg`: same family as dark secondary/card surfaces
- `--color-code-text`: `#FFFFFF` or near-white
- `--color-code-border`: same as dark border

### Light Mode

Light mode should use the Codex light settings while preserving readable blog contrast:

- `--color-bg: #FFFFFF`
- `--color-text: #1A1C1F`
- `--color-bg-secondary`: derived light surface around `#F6F7F8`
- `--color-card-bg`: `#FFFFFF`
- `--color-bg-hover`: derived hover surface around `#EEF2F6`
- `--color-border`: neutral divider around `#D8DCE2`
- `--color-text-muted`: neutral muted foreground around `#667085`
- `--color-code-bg`: derived light code surface around `#F6F7F8`
- `--color-code-text`: `#1A1C1F`
- `--color-code-border`: same as light border

## Implementation Scope

Future implementation should:

1. Update `src/styles/global.css` variable blocks:
   - `:root`
   - `@media (prefers-color-scheme: dark)` fallback
   - `[data-theme='dark']`
   - `[data-theme='light']`
2. Replace old Tiffany Blue and ChatGPT gray color values with Codex app values.
3. Keep the existing `data-theme` switching model and `ThemeToggle.astro` behavior unchanged.
4. Keep typography sizing and layout rules unchanged unless a hard-coded color prevents the new theme from working.
5. Search for hard-coded colors in `src/` and replace only the values that conflict with the global color system.
6. Keep `QianPet.astro` as a separate visual character system unless its focus outline or global integration uses the old accent variable.
7. Update the development log before the implementation commit, following `AGENTS.md`.

## Non-Goals

- Do not redesign page layout.
- Do not change article Markdown content.
- Do not change Decap CMS configuration.
- Do not change Vercel, Cloudflare, GitHub OAuth, or domain settings.
- Do not introduce a UI framework or new npm dependency.
- Do not remove the existing light/dark/system theme behavior.

## Verification Plan

After implementation, run:

```bash
npm run build
```

Then verify visually in both themes:

- Dark page background matches `#181818`.
- Dark main text is white and readable.
- Navigation active state, links, buttons, focus rings, tags, and selected text use Codex blue.
- Cards, code blocks, changelog groups, article pages, categories, and floating buttons remain readable.
- No old Tiffany Blue values remain in active theme variables.

## Self-Review

- No placeholders or unresolved decisions remain.
- The selected approach is scoped to the existing variable system.
- The design distinguishes screenshot-provided source values from derived surface values.
- The implementation scope avoids unrelated service, content, and layout changes.
