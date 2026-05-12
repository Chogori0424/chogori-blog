# Transparent Avatar Replacement Design

## Goal

Replace the site's avatar with `C:\Users\16354\Downloads\U2.png` while ensuring the avatar blends naturally on every page background. The provided PNG contains visible checkerboard pixels rather than a real transparent background, so the implementation must remove that checkerboard and produce an alpha-transparent site avatar.

## Approved Approach

Use the transparent cutout approach:

- Detect the light checkerboard background connected to the source image edges.
- Convert that background area to alpha transparency.
- Save the processed image as the canonical site avatar under `public/images/avatar.webp`.
- Regenerate favicon, Apple touch icon, and PWA icons from the new transparent avatar source.
- Remove the visible avatar border in shared avatar CSS so the portrait edge blends more naturally with surrounding page backgrounds.

## Files In Scope

- `public/images/avatar.webp`
- `public/favicon.svg`
- `public/favicon.ico`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png`
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `scripts/generate-icons.mjs`
- `src/styles/global.css`
- `src/data/devlog.json`

## Implementation Notes

The existing `Avatar.astro` component already centralizes avatar usage through `AUTHOR_AVATAR`, so it does not need a component API change. The CSS change belongs in the shared `.avatar` rule: remove the current border and set the avatar background to `transparent`.

The icon generator should continue producing circular icon assets, but it must preserve transparent source edges before applying the circular mask. Apple and PWA icon files may remain PNGs with alpha.

## Verification

Verification should include:

- Inspect processed avatar metadata to confirm it has alpha.
- Run icon generation.
- Run `npm run build`.
- Visually check the homepage/about/header avatar on the built or dev site against dark and light surfaces where applicable.
- Confirm `git status` contains only intended source, asset, icon, and devlog changes.
