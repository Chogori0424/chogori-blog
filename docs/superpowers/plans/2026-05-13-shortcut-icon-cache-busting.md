# Shortcut Icon Cache Busting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Chrome shortcut icons under new versioned paths so Chrome does not reuse cached old icon URLs.

**Architecture:** Keep the existing generator output for legacy root icon paths, and additionally write versioned shortcut icon files under `public/icons/`. Update manifest and head links to point to those new paths.

**Tech Stack:** Node.js ESM, Sharp, Astro head component, web app manifest.

---

### Task 1: Generate Versioned Shortcut Icon Files

**Files:**
- Modify: `scripts/generate-icons.mjs`
- Create: `public/icons/chrome-shortcut-192-v2.png`
- Create: `public/icons/chrome-shortcut-512-v2.png`
- Create: `public/icons/apple-touch-icon-v2.png`

- [ ] **Step 1: Import `mkdir`**

Change the import:

```js
import { mkdir, writeFile } from 'node:fs/promises';
```

- [ ] **Step 2: Add versioned shortcut paths**

Add a second shortcut array after `shortcutSizes`:

```js
const versionedShortcutSizes = [
	['public/icons/apple-touch-icon-v2.png', 180],
	['public/icons/chrome-shortcut-192-v2.png', 192],
	['public/icons/chrome-shortcut-512-v2.png', 512],
];
```

- [ ] **Step 3: Ensure the directory exists and write both old and new shortcut files**

Before writing shortcut files, add:

```js
await mkdir('public/icons', { recursive: true });
```

Then write both arrays:

```js
for (const [path, size] of [...shortcutSizes, ...versionedShortcutSizes]) {
	await writeFile(path, await renderShortcutIcon(size));
}
```

### Task 2: Update Manifest and Head Links

**Files:**
- Modify: `public/site.webmanifest`
- Modify: `src/components/BaseHead.astro`

- [ ] **Step 1: Point manifest icons at versioned Chrome shortcut paths**

Use these manifest icon entries:

```json
{
	"src": "/icons/chrome-shortcut-192-v2.png",
	"sizes": "192x192",
	"type": "image/png",
	"purpose": "any maskable"
}
```

and:

```json
{
	"src": "/icons/chrome-shortcut-512-v2.png",
	"sizes": "512x512",
	"type": "image/png",
	"purpose": "any maskable"
}
```

- [ ] **Step 2: Version the manifest and Apple touch links**

Update `BaseHead.astro`:

```astro
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-v2.png" />
<link rel="manifest" href="/site.webmanifest?v=20260513-shortcut-v2" />
```

### Task 3: Verify and Deploy

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: Generate icons**

Run:

```powershell
npm run icons:generate
```

Expected: exits `0`.

- [ ] **Step 2: Check versioned icons are opaque**

Run:

```powershell
node -e "import sharp from 'sharp'; for (const f of ['public/icons/chrome-shortcut-192-v2.png','public/icons/chrome-shortcut-512-v2.png','public/icons/apple-touch-icon-v2.png']) { const {data,info}=await sharp(f).ensureAlpha().raw().toBuffer({resolveWithObject:true}); let transparent=0, mid=0, opaque=0; for(let i=3;i<data.length;i+=4){ const a=data[i]; if(a===0) transparent++; else if(a===255) opaque++; else mid++; } console.log(f, JSON.stringify({width:info.width,height:info.height,transparent,mid,opaque})); }"
```

Expected: each file has `transparent:0` and `mid:0`.

- [ ] **Step 3: Add devlog entry**

Run:

```powershell
npm run devlog:add -- --type fix --title "强制刷新快捷方式图标路径" --description "为 Chrome 与 Apple 快捷方式图标新增版本化路径，并让 manifest 指向新图标，避免旧快捷方式图标缓存继续复用。" --tags "icons,pwa,cache"
```

- [ ] **Step 4: Build, commit, push, verify production**

Run:

```powershell
npm run build
git add scripts/generate-icons.mjs public/site.webmanifest src/components/BaseHead.astro src/data/devlog.json public/icons/chrome-shortcut-192-v2.png public/icons/chrome-shortcut-512-v2.png public/icons/apple-touch-icon-v2.png public/apple-touch-icon.png public/android-chrome-192x192.png public/android-chrome-512x512.png docs/superpowers/specs/2026-05-13-shortcut-icon-cache-busting-design.md docs/superpowers/plans/2026-05-13-shortcut-icon-cache-busting.md
git commit -m "fix: cache bust shortcut icon assets"
git push origin main
```

Then verify:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'https://chogori.xyz/site.webmanifest'
Invoke-WebRequest -UseBasicParsing -Uri 'https://chogori.xyz/icons/chrome-shortcut-192-v2.png'
```
