# Route Map Gesture Zoom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Hong Kong one-day trip route map with a sharper local PNG and gesture-based map viewing.

**Architecture:** Keep the article as MDX and the map as a static local PNG. Regenerate the PNG from OpenStreetMap tiles at higher resolution with thinner route strokes, then replace the current preset zoom buttons with a local pan/zoom viewer driven by native DOM events.

**Tech Stack:** Astro MDX, OpenStreetMap tiles, Python/Pillow image generation, vanilla JavaScript pointer/wheel events, existing devlog scripts.

---

### Task 1: Regenerate The Route Map Asset

**Files:**
- Modify: `public/uploads/hong-kong-one-day-route-map.png`

- [x] **Step 1: Generate a higher-resolution PNG**

Run an inline Python/Pillow generator that:
- Outputs `2400x1664`.
- Uses OpenStreetMap tiles and keeps the copyright attribution.
- Draws the Luohu main route as a thinner blue curve.
- Draws Futian/Lok Ma Chau as a thinner orange dashed curve.
- Draws the Star Ferry/Victoria Harbour segment as a thinner green curve.
- Keeps labels for Baolong, Luohu, Futian, Wong Tai Sin, Nan Lian Garden, Choi Hung, MacLehose Trail Section 5, Sino Centre, Temple Street, Tsim Sha Tsui, Central Pier, and Admiralty.

Expected: `public/uploads/hong-kong-one-day-route-map.png` exists and reports roughly `2400x1664`.

### Task 2: Replace Preset Zoom Buttons With Gesture Viewer

**Files:**
- Modify: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`

- [x] **Step 1: Replace toolbar copy**

Replace `总览 / 放大 1.6x / 放大 2.4x` with:
- A compact status label showing `1.0x`.
- A `重置视图` button.
- The existing `打开原图` link.

- [x] **Step 2: Update CSS**

Keep the same article-local style block, but update the viewer so:
- The viewport hides overflow and remains inside article width.
- The map layer uses `transform-origin: 0 0`.
- Touch handling is scoped to the map viewport with `touch-action: none`.
- Mobile height remains readable without changing global styles.

- [x] **Step 3: Replace JavaScript**

Replace preset zoom logic with native pan/zoom state:
- `scale` clamped from `1` to `4`.
- Desktop `wheel` zoom anchors around the mouse pointer.
- Two-finger touch zoom anchors around the pinch center.
- Single pointer drag pans after zooming.
- `重置视图` restores `scale=1`, `x=0`, `y=0`.
- Scale display updates after every transform.

### Task 3: Update Devlog And Verify

**Files:**
- Modify: `src/data/devlog.json`

- [x] **Step 1: Add devlog entry**

Run:

```powershell
npm run devlog:add -- --type content --title "优化香港路线图手势缩放" --description "将香港一日游路线图升级为高清细线路线图，并支持桌面滚轮缩放、移动端双指缩放和拖拽平移" --tags "香港,路线图,交互"
```

Expected: output contains `Added changelog item`.

- [x] **Step 2: Build**

Run:

```powershell
npm run build
```

Expected: exit 0 and the article route is generated.

- [x] **Step 3: Existing tests**

Run:

```powershell
node --test tests\bot-public-profile.test.mjs
```

Expected: 7 tests, 0 failures.

- [x] **Step 4: Page checks**

Verify:
- Article URL returns 200.
- Map PNG URL returns 200.
- Built HTML contains the gesture viewer attributes.
- Browser interaction can increase scale above `1` and reset it to `1`.
