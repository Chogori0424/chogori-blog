# Route Map Zoom Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将香港一日游文章中的路线图升级为可缩放、可拖动查看的局部地图查看器，改善固定缩放下路线和标注可读性。

**Architecture:** 只修改当前 MDX 文章和开发日志，不改全站布局、不新增全局组件。查看器用文章内局部 HTML/CSS/JS 实现，围绕现有 `/uploads/hong-kong-one-day-route-map.png` 图片提供 1x、1.6x、2.4x 缩放按钮、可滚动视窗和打开原图链接。

**Tech Stack:** Astro MDX、局部 CSS、原生 DOM 脚本、项目现有 devlog 脚本、Astro build。

---

### Task 1: 更新文章地图模块

**Files:**
- Modify: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`

- [x] **Step 1: 替换 figure 内容**

将当前单图 `<figure>` 改成 `.route-map-viewer`：
- 顶部工具栏包含 `总览`、`放大 1.6x`、`放大 2.4x` 三个按钮。
- 右侧保留 `打开原图` 外链。
- 图片放入 `.route-map-scroll`，默认宽度 100%，放大时宽度切换为 `160%` / `240%`，容器允许横向和纵向滚动。

- [x] **Step 2: 增加局部样式**

在 MDX 内增加 `<style>`：
- `.route-map-viewer` 使用现有 `var(--radius-card)`、`var(--surface-soft)`、`var(--color-card-border)`。
- `.route-map-scroll` 高度使用 `clamp(360px, 70vh, 760px)`，移动端不低于 `320px`。
- 缩放按钮使用 `var(--radius-pill)`，当前按钮用 `aria-pressed="true"` 和 accent 色。

- [x] **Step 3: 增加局部脚本**

在 MDX 内增加 `<script is:inline>`：
- 查找 `[data-route-map-viewer]`。
- 点击 `[data-map-zoom]` 时更新图片宽度和按钮 `aria-pressed`。
- 切换放大时把滚动位置设置到路线图中心区域，避免放大后仍停留在左上角。

### Task 2: 更新开发日志并验证

**Files:**
- Modify: `src/data/devlog.json`

- [x] **Step 1: 新增 devlog**

Run:

```powershell
npm run devlog:add -- --type content --title "优化香港路线图缩放查看" --description "为香港一日游文章的路线图增加总览、1.6 倍和 2.4 倍缩放查看，并支持在固定视窗内拖动查看路线细节" --tags "香港,路线图,交互"
```

Expected: 输出 `Added changelog item`。

- [x] **Step 2: 构建验证**

Run:

```powershell
npm run build
```

Expected: exit 0，并生成 `/blog/2026-05-17-hong-kong-one-day-plan/index.html`。

- [x] **Step 3: 测试验证**

Run:

```powershell
node --test tests\bot-public-profile.test.mjs
```

Expected: 7 tests, 0 failures。

- [x] **Step 4: 页面检查**

检查构建产物和本地页面：
- HTML 包含 `data-route-map-viewer`。
- HTML 包含 `data-map-zoom="1.6"` 和 `data-map-zoom="2.4"`。
- 页面 URL 和图片 URL 均返回 200。
