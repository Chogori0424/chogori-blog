# Chrome Shortcut Icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate Chrome/PWA shortcut icons as full-canvas maskable assets so the portrait no longer appears reduced inside a launcher shortcut.

**Architecture:** Keep the transparent avatar generation unchanged for in-page use. Split icon rendering into two paths in `scripts/generate-icons.mjs`: transparent circular favicon assets for browser chrome, and opaque full-canvas shortcut assets for `apple-touch-icon.png` and `android-chrome-*`.

**Tech Stack:** Node.js ESM, Sharp image processing, Astro static assets, web app manifest, existing devlog tooling.

---

### Task 1: Split Favicon and Shortcut Icon Rendering

**Files:**
- Modify: `scripts/generate-icons.mjs`
- Modify: `public/apple-touch-icon.png`
- Modify: `public/android-chrome-192x192.png`
- Modify: `public/android-chrome-512x512.png`
- Modify: `public/favicon-16x16.png`
- Modify: `public/favicon-32x32.png`
- Modify: `public/favicon.ico`
- Modify: `public/favicon.svg`
- Modify: `public/images/avatar.webp`

- [ ] **Step 1: Add shortcut rendering constants**

Add constants near the existing `zoom` declaration:

```js
const sourceImage = 'scripts/assets/avatar-source.png';
const avatarPath = 'public/images/avatar.webp';
const faviconZoom = 1.08;
const shortcutBackground = '#0f172a';
const shortcutPortraitScale = 1.18;
```

- [ ] **Step 2: Keep favicon rendering circular and transparent**

Rename the existing circular icon renderer to `renderCircularFavicon` and make it use `faviconZoom`:

```js
async function renderCircularFavicon(size) {
	const enlarged = Math.ceil(size * faviconZoom);
	const offset = Math.floor((enlarged - size) / 2);

	return sharp(avatarPath)
		.resize(enlarged, enlarged, { fit: 'cover', position: 'center' })
		.extract({ left: offset, top: offset, width: size, height: size })
		.ensureAlpha()
		.composite([{ input: circleMask(size), blend: 'dest-in' }])
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toBuffer();
}
```

- [ ] **Step 3: Add opaque full-canvas shortcut renderer**

Add this new function after `renderCircularFavicon`:

```js
async function renderShortcutIcon(size) {
	const portraitSize = Math.round(size * shortcutPortraitScale);
	const offset = Math.floor((portraitSize - size) / 2);

	const portrait = await sharp(avatarPath)
		.resize(portraitSize, portraitSize, { fit: 'cover', position: 'center' })
		.extract({ left: offset, top: offset, width: size, height: size })
		.ensureAlpha()
		.png()
		.toBuffer();

	return sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: shortcutBackground,
		},
	})
		.composite([{ input: portrait, left: 0, top: 0 }])
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toBuffer();
}
```

- [ ] **Step 4: Replace the single `iconSizes` loop with separate favicon and shortcut loops**

Use separate arrays and render functions:

```js
const faviconSizes = [
	['public/favicon-16x16.png', 16],
	['public/favicon-32x32.png', 32],
];

const shortcutSizes = [
	['public/apple-touch-icon.png', 180],
	['public/android-chrome-192x192.png', 192],
	['public/android-chrome-512x512.png', 512],
];

await createTransparentAvatar();

const renderedFavicons = new Map();
for (const [path, size] of faviconSizes) {
	const buffer = await renderCircularFavicon(size);
	renderedFavicons.set(size, buffer);
	await writeFile(path, buffer);
}

for (const [path, size] of shortcutSizes) {
	await writeFile(path, await renderShortcutIcon(size));
}
```

- [ ] **Step 5: Update ICO and SVG generation to use favicon assets**

Update the existing `favicon.ico` and `favicon.svg` code:

```js
const favicon48 = await renderCircularFavicon(48);
await writeFile(
	'public/favicon.ico',
	makeIco([
		{ size: 16, buffer: renderedFavicons.get(16) },
		{ size: 32, buffer: renderedFavicons.get(32) },
		{ size: 48, buffer: favicon48 },
	]),
);

const svgPng = (await renderCircularFavicon(192)).toString('base64');
await writeFile(
	'public/favicon.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image href="data:image/png;base64,${svgPng}" width="512" height="512"/></svg>\n`,
);
```

- [ ] **Step 6: Generate all icons**

Run:

```powershell
npm run icons:generate
```

Expected: command exits with code `0` and prints `Generated circular favicon, Apple touch, and PWA icon assets.`

### Task 2: Verify Shortcut Icon Pixel Geometry

**Files:**
- Read: `public/android-chrome-192x192.png`
- Read: `public/android-chrome-512x512.png`
- Read: `public/apple-touch-icon.png`
- Read: `public/images/avatar.webp`

- [ ] **Step 1: Confirm shortcut icons are opaque full canvases**

Run:

```powershell
node -e "import sharp from 'sharp'; for (const f of ['public/android-chrome-192x192.png','public/android-chrome-512x512.png','public/apple-touch-icon.png']) { const {data,info}=await sharp(f).ensureAlpha().raw().toBuffer({resolveWithObject:true}); let transparent=0, mid=0, opaque=0; for(let i=3;i<data.length;i+=4){ const a=data[i]; if(a===0) transparent++; else if(a===255) opaque++; else mid++; } console.log(f, JSON.stringify({width:info.width,height:info.height,transparent,mid,opaque})); }"
```

Expected: each shortcut icon reports `transparent:0` and `mid:0`.

- [ ] **Step 2: Confirm the in-page avatar remains transparent**

Run:

```powershell
node -e "import sharp from 'sharp'; const {data,info}=await sharp('public/images/avatar.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true}); let zero=0, mid=0, full=0; for(let i=3;i<data.length;i+=4){ const a=data[i]; if(a===0) zero++; else if(a===255) full++; else mid++; } console.log(JSON.stringify({width:info.width,height:info.height,zero,mid,full}));"
```

Expected: `zero` is greater than `0`, proving the in-page avatar still has transparent background.

- [ ] **Step 3: Render a quick visual contact sheet**

Run:

```powershell
node -e "import sharp from 'sharp'; await sharp({ create: { width: 760, height: 280, channels: 4, background: '#f4f4f5' } }).composite([{ input: 'public/android-chrome-192x192.png', left: 32, top: 44 }, { input: 'public/apple-touch-icon.png', left: 284, top: 50 }, { input: await sharp('public/android-chrome-512x512.png').resize(192,192).png().toBuffer(), left: 536, top: 44 }]).png().toFile('dist/chrome-shortcut-icon-preview.png');"
```

Expected: `dist/chrome-shortcut-icon-preview.png` shows larger portrait shortcut icons on dark square canvases.

### Task 3: Validate Manifest and Build

**Files:**
- Read: `public/site.webmanifest`
- Build output: `dist/`

- [ ] **Step 1: Confirm manifest still points to Chrome shortcut assets**

Run:

```powershell
Get-Content -LiteralPath public\site.webmanifest
```

Expected: `android-chrome-192x192.png` and `android-chrome-512x512.png` remain listed with `purpose: "any maskable"`.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: Astro build exits with code `0`.

### Task 4: Update Development Log

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: Add devlog entry**

Run:

```powershell
npm run devlog:add -- --type fix --title "修复 Chrome 快捷方式图标缩放" --description "将 PWA 与 Apple touch 图标改为适合快捷方式的满画布图标，避免透明圆形头像被 Chrome 或系统二次缩小。" --tags "icons,pwa,chrome"
```

Expected: command exits with code `0` and appends one `fix` entry unless an identical title already exists.

- [ ] **Step 2: Verify devlog entry**

Run:

```powershell
npm run devlog:latest
```

Expected: newest entries include `修复 Chrome 快捷方式图标缩放`.

### Task 5: Final Commit and Deploy

**Files:**
- Review all changed files from `git status --short`

- [ ] **Step 1: Review status and diff**

Run:

```powershell
git status --short
git diff -- scripts/generate-icons.mjs public/site.webmanifest src/data/devlog.json docs/superpowers/plans/2026-05-13-chrome-shortcut-icon.md
git diff --stat
```

Expected: changes are limited to icon generation, generated icon assets, devlog, and this plan.

- [ ] **Step 2: Commit implementation**

Run:

```powershell
git add scripts/generate-icons.mjs src/data/devlog.json public/apple-touch-icon.png public/android-chrome-192x192.png public/android-chrome-512x512.png public/favicon.svg public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/images/avatar.webp docs/superpowers/plans/2026-05-13-chrome-shortcut-icon.md
git commit -m "fix: improve chrome shortcut icon sizing"
```

Expected: commit succeeds.

- [ ] **Step 3: Push to production branch**

Run:

```powershell
git push origin main
```

Expected: push succeeds and Vercel starts a production deployment from `main`.

- [ ] **Step 4: Verify production deployment**

Run:

```powershell
npx vercel ls chogori-blog
npx vercel inspect <latest-production-url>
```

Expected: latest production deployment is `Ready` and aliases include `https://chogori.xyz`.
