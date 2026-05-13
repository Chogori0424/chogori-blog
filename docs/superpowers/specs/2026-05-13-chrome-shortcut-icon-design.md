# Chrome Shortcut Icon Design

## Goal

Fix the Chrome home-screen shortcut icon where the avatar appears too small inside a dark circular background. The shortcut icon is driven by the web app manifest assets, not by the in-page avatar component.

## Problem

The current `android-chrome-192x192.png` and `android-chrome-512x512.png` assets are transparent circular avatar images, while `public/site.webmanifest` marks them as `purpose: "any maskable"`. Chrome and the operating system treat these files as maskable app icons and apply their own safe-area mask. Because the source asset is already a transparent circle, the result is visually double-masked and the portrait appears reduced.

## Approved Approach

Use dedicated full-canvas shortcut icons for Chrome/PWA install surfaces:

- Keep the in-page avatar transparent.
- Keep favicon assets optimized for browser chrome.
- Generate `android-chrome-192x192.png` and `android-chrome-512x512.png` as full square canvases with the site dark background color.
- Place a larger centered portrait on those square canvases so it survives Chrome and launcher mask safe-area scaling.
- Keep manifest icon entries as `purpose: "any maskable"` because the generated images will now be valid maskable assets.
- Regenerate `apple-touch-icon.png` as the same full-canvas shortcut-style image so iOS saved icons do not show an unexpected transparent matte.

## Files In Scope

- `scripts/generate-icons.mjs`
- `public/site.webmanifest`
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `public/apple-touch-icon.png`
- `public/favicon.svg`
- `public/favicon.ico`
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/images/avatar.webp`
- `src/data/devlog.json`

## Implementation Notes

The generator should create two icon styles from the same processed transparent avatar:

- Browser favicon style: transparent circular crop for `favicon-*`, `favicon.ico`, and `favicon.svg`.
- Shortcut icon style: full opaque square canvas for `apple-touch-icon.png` and `android-chrome-*`.

Shortcut icons should use `#0f172a` for the background and a larger portrait scale than favicon assets. The exact scale can be tuned during verification, but the generated portrait should occupy substantially more of the final canvas than the current Chrome shortcut screenshot.

## Verification

Verification should include:

- Confirm `android-chrome-*` and `apple-touch-icon.png` are opaque full-canvas PNGs.
- Confirm the non-background portrait bounds occupy a larger share of the shortcut icon canvas.
- Confirm `public/images/avatar.webp` still has alpha for in-page use.
- Run `npm run icons:generate`.
- Run `npm run build`.
- Inspect `/site.webmanifest` and shortcut icon URLs locally.
- Update the devlog.

Existing Chrome shortcuts may cache the old icon. After deployment, users may need to remove and re-add the shortcut to see the new icon.
