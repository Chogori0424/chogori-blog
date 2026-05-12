# Transparent Avatar Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site avatar with the provided portrait image, remove the fake checkerboard background, and make the avatar render without a visible border.

**Architecture:** Keep `Avatar.astro` as the single consumer of `AUTHOR_AVATAR`. Add source-image background removal to `scripts/generate-icons.mjs`, use it to write `public/images/avatar.webp`, then reuse the same processed avatar for all favicon, Apple touch, and PWA icon generation.

**Tech Stack:** Astro 6, Node.js ESM scripts, Sharp image processing, CSS custom properties, existing devlog tooling.

---

### Task 1: Make Icon Generation Produce a Transparent Canonical Avatar

**Files:**
- Create: `scripts/assets/avatar-source.png`
- Modify: `scripts/generate-icons.mjs`
- Modify: `public/images/avatar.webp`
- Modify: `public/favicon.svg`
- Modify: `public/favicon.ico`
- Modify: `public/favicon-16x16.png`
- Modify: `public/favicon-32x32.png`
- Modify: `public/apple-touch-icon.png`
- Modify: `public/android-chrome-192x192.png`
- Modify: `public/android-chrome-512x512.png`

- [ ] **Step 1: Replace the icon generator with source cutout processing**

Copy `C:/Users/16354/Downloads/U2.png` to `scripts/assets/avatar-source.png`, then update `scripts/generate-icons.mjs` so it reads that repo-local source image, removes the edge-connected light checkerboard pixels, writes `public/images/avatar.webp` with alpha, then regenerates all existing icon assets from that canonical avatar.

```js
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const sourceImage = 'scripts/assets/avatar-source.png';
const avatarPath = 'public/images/avatar.webp';
const zoom = 1.08;

function circleMask(size) {
	const radius = size / 2 - 0.35;
	return Buffer.from(
		`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="#fff"/></svg>`,
	);
}

function isCheckerPixel(r, g, b) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	return r >= 224 && g >= 224 && b >= 224 && max - min <= 18;
}

async function createTransparentAvatar() {
	const { data, info } = await sharp(sourceImage)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width, height } = info;
	const background = new Uint8Array(width * height);
	const queue = [];

	function visit(x, y) {
		if (x < 0 || y < 0 || x >= width || y >= height) return;
		const index = y * width + x;
		if (background[index]) return;

		const offset = index * 4;
		if (!isCheckerPixel(data[offset], data[offset + 1], data[offset + 2])) return;

		background[index] = 1;
		queue.push(index);
	}

	for (let x = 0; x < width; x++) {
		visit(x, 0);
		visit(x, height - 1);
	}
	for (let y = 0; y < height; y++) {
		visit(0, y);
		visit(width - 1, y);
	}

	for (let head = 0; head < queue.length; head++) {
		const index = queue[head];
		const x = index % width;
		const y = Math.floor(index / width);
		visit(x + 1, y);
		visit(x - 1, y);
		visit(x, y + 1);
		visit(x, y - 1);
	}

	const output = Buffer.from(data);
	for (let index = 0; index < background.length; index++) {
		if (background[index]) output[index * 4 + 3] = 0;
	}

	await sharp(output, { raw: { width, height, channels: 4 } })
		.resize(640, 640, { fit: 'cover', position: 'center' })
		.webp({ quality: 92, effort: 6, alphaQuality: 100 })
		.toFile(avatarPath);
}

async function renderCircularIcon(size) {
	const enlarged = Math.ceil(size * zoom);
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

- [ ] **Step 2: Preserve the existing ICO and SVG writing logic**

Keep the current `makeIco`, `iconSizes`, PNG writing loop, `favicon.ico`, and `favicon.svg` output behavior after the helper functions. Add `await createTransparentAvatar();` before rendering icons.

```js
await createTransparentAvatar();

const rendered = new Map();
for (const [path, size] of iconSizes) {
	const buffer = await renderCircularIcon(size);
	rendered.set(size, buffer);
	await writeFile(path, buffer);
}
```

- [ ] **Step 3: Generate the avatar and icons**

Run:

```powershell
npm run icons:generate
```

Expected: command exits with code `0` and prints `Generated circular favicon, Apple touch, and PWA icon assets.`

- [ ] **Step 4: Confirm the canonical avatar has alpha**

Run:

```powershell
node -e "import sharp from 'sharp'; for (const f of ['public/images/avatar.webp','public/favicon-32x32.png','public/apple-touch-icon.png']) { const m = await sharp(f).metadata(); console.log(f, JSON.stringify({ width: m.width, height: m.height, channels: m.channels, hasAlpha: m.hasAlpha })); }"
```

Expected: `public/images/avatar.webp` reports `hasAlpha:true`. The icon PNGs report `hasAlpha:true`.

### Task 2: Remove the Avatar Border and Solid Background

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Update the shared avatar rule**

Change the `.avatar` rule so it has no visible border and no fixed black background:

```css
.avatar {
	display: block;
	flex: none;
	box-sizing: border-box;
	width: var(--avatar-size, 72px);
	height: var(--avatar-size, 72px);
	aspect-ratio: 1 / 1;
	object-fit: cover;
	object-position: center 42%;
	border: 0;
	border-radius: var(--avatar-radius, 24px);
	background: transparent;
	filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 32%));
}
```

Change `.avatar--site` to use a smaller alpha-aware drop shadow instead of a box shadow:

```css
.avatar--site {
	--avatar-size: 32px;
	--avatar-radius: 10px;
	filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 28%));
}
```

- [ ] **Step 2: Check no other avatar border declarations remain**

Run:

```powershell
rg -n "avatar|border: 1px solid rgba\\(255, 255, 255" src/styles/global.css src/components
```

Expected: `.avatar` still exists, variant classes still exist, and there is no avatar-specific `border: 1px` or `box-shadow` rule.

### Task 3: Record the Development Log

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: Add a devlog entry with the existing script**

Run:

```powershell
npm run devlog:add -- --type style --title "更换透明头像资源" --description "将全站头像替换为透明抠图资源，移除头像边框，并重新生成 favicon、Apple touch icon 和 PWA 图标。" --tags "avatar,icons,visual"
```

Expected: command exits with code `0` and appends one `style` entry unless an identical title already exists.

- [ ] **Step 2: Verify the newest devlog entry**

Run:

```powershell
npm run devlog:latest
```

Expected: the newest entries include `更换透明头像资源`.

### Task 4: Build and Visual Verification

**Files:**
- Read: `src/components/Avatar.astro`
- Read: `src/pages/index.astro`
- Read: `src/pages/about.astro`
- Read: `src/styles/global.css`

- [ ] **Step 1: Run the production build**

Run:

```powershell
npm run build
```

Expected: Astro build exits with code `0`.

- [ ] **Step 2: Start or reuse the local dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1
```

Expected: a local URL is available, typically `http://127.0.0.1:4321/`.

- [ ] **Step 3: Visually inspect the homepage**

Open the homepage and confirm:

- The header and hero avatar show the new portrait.
- No checkerboard background is visible.
- No visible avatar border is shown.
- The avatar does not have a black square or mismatched matte behind it.

- [ ] **Step 4: Visually inspect the about page**

Open `/about/` and confirm:

- The about avatar shows the same new portrait.
- The transparent background blends with the page background.
- No visible avatar border is shown.

### Task 5: Final Git Review and Commit

**Files:**
- Review all modified files from `git status --short`

- [ ] **Step 1: Review changed files**

Run:

```powershell
git status --short
```

Expected changed files:

- `scripts/generate-icons.mjs`
- `src/styles/global.css`
- `src/data/devlog.json`
- `public/images/avatar.webp`
- `scripts/assets/avatar-source.png`
- generated icon files under `public/`
- this implementation plan

- [ ] **Step 2: Review source diffs**

Run:

```powershell
git diff -- scripts/generate-icons.mjs src/styles/global.css src/data/devlog.json docs/superpowers/plans/2026-05-13-transparent-avatar-replacement.md
```

Expected: diffs match the transparent avatar generation, no-border CSS, devlog entry, and implementation plan only.

- [ ] **Step 3: Commit the completed implementation**

Run:

```powershell
git add scripts/generate-icons.mjs scripts/assets/avatar-source.png src/styles/global.css src/data/devlog.json public/images/avatar.webp public/favicon.svg public/favicon.ico public/favicon-16x16.png public/favicon-32x32.png public/apple-touch-icon.png public/android-chrome-192x192.png public/android-chrome-512x512.png docs/superpowers/plans/2026-05-13-transparent-avatar-replacement.md
git commit -m "style: replace site avatar with transparent portrait"
```

Expected: commit succeeds after verification.
