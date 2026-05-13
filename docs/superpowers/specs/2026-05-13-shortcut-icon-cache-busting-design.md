# Shortcut Icon Cache Busting Design

## Goal

Force Chrome home-screen shortcut creation to fetch the corrected large shortcut icon instead of reusing the old cached `android-chrome-*` icon URLs.

## Root Cause Evidence

Production `https://chogori.xyz/android-chrome-192x192.png` now returns the corrected full-canvas icon, but the user's shortcut still displays the old small portrait inside a dark circle. The remaining failure mode is Chrome or the operating system using cached shortcut icon resources from unchanged URLs.

## Approved Follow-Up Approach

Keep the existing full-canvas shortcut icon rendering, but publish the shortcut icons at new versioned paths:

- `/icons/chrome-shortcut-192-v2.png`
- `/icons/chrome-shortcut-512-v2.png`
- `/icons/apple-touch-icon-v2.png`

Update `public/site.webmanifest` to reference the new Chrome shortcut icon paths, and update `BaseHead.astro` to reference the manifest with a version query and the new Apple touch icon path. Keep the legacy root icon files generated for compatibility.

## Files In Scope

- `scripts/generate-icons.mjs`
- `public/site.webmanifest`
- `src/components/BaseHead.astro`
- `public/icons/chrome-shortcut-192-v2.png`
- `public/icons/chrome-shortcut-512-v2.png`
- `public/icons/apple-touch-icon-v2.png`
- existing generated root icon files
- `src/data/devlog.json`

## Verification

- Run `npm run icons:generate`.
- Confirm new versioned icon files exist and are opaque full-canvas PNGs.
- Confirm `public/site.webmanifest` references `/icons/chrome-shortcut-*`.
- Confirm `BaseHead.astro` links `/site.webmanifest?v=20260513-shortcut-v2`.
- Run `npm run build`.
- Verify production `/site.webmanifest` and new icon URLs after deployment.

Existing already-created OS shortcuts may still need to be deleted and re-added, because operating systems can store shortcut icons outside the browser cache.
