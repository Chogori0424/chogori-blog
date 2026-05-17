# Hong Kong Classic Photos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在香港一日游规划文章中插入可合法复用的经典地点照片，增强阅读识别度，同时保留现有博客系统和视觉风格。

**Architecture:** 图片下载到 `public/uploads/` 本地托管，文章内用 MDX 局部 `<figure>` 和 `<img>` 插入，不新增全局组件、不改全站样式。每张照片带中文说明、来源、作者和许可链接，避免版权不明素材。

**Tech Stack:** Astro、MDX、Markdown/HTML figure、Wikimedia Commons / 可复用图片资源、npm build、Node test runner。

---

### Task 1: 确认素材与版权来源

**Files:**
- Read: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`
- Create image assets under: `public/uploads/`

- [x] **Step 1: 选取 4 个文章内地点对应照片**

选择与正文路线直接相关的经典场景：

| 图片用途 | 放置位置 | 选择标准 |
|---|---|---|
| 维港 / 尖沙咀天际线 | 路线图之后 | 第一屏之后的强识别照片 |
| 狮子山 / 麦理浩径相关山景 | 麦理浩径压缩段之前 | 对应山径段，不暗示一定登顶 |
| 旺角 / 弥敦道街景 | 旺角信和中心之前 | 对应旺角亚文化和商场周边 |
| 天星小轮 / 维港渡轮 | 维港和天星小轮段之前 | 对应文章推荐的内部交通体验 |

- [x] **Step 2: 只使用可复用来源**

优先使用 Wikimedia Commons 或 Openverse 可确认许可的图片。每张图记录：

```text
title:
author:
source_url:
license:
license_url:
local_filename:
```

- [x] **Step 3: 下载到本地**

下载文件到：

```text
public/uploads/hong-kong-victoria-harbour-classic.jpg
public/uploads/hong-kong-lion-rock-trail-classic.jpg
public/uploads/hong-kong-mong-kok-nathan-road-classic.jpg
public/uploads/hong-kong-star-ferry-classic.jpg
```

### Task 2: 插入文章照片

**Files:**
- Modify: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`

- [x] **Step 1: 增加局部照片样式**

在现有 `<style>` 中加入文章局部样式，保持 rounded-2xl 风格：

```css
.classic-photo {
	margin: 1.75rem 0;
}
.classic-photo img {
	display: block;
	width: 100%;
	height: auto;
	border-radius: 1.5rem;
	border: 1px solid var(--color-card-border);
	background: var(--surface-soft);
}
.classic-photo figcaption {
	margin-top: 0.65rem;
	color: var(--color-text-muted);
	font-size: 0.9rem;
	line-height: 1.6;
}
.classic-photo figcaption a {
	color: var(--color-accent);
}
```

- [x] **Step 2: 在路线图后插入维港照片**

插入：

```mdx
<figure className="classic-photo">
	<img src="/uploads/hong-kong-victoria-harbour-classic.jpg" alt="从尖沙咀方向看维港与香港岛天际线" loading="lazy" decoding="async" />
	<figcaption>维港和香港岛天际线是当天最适合作为收尾的画面。图片：作者 / 许可。</figcaption>
</figure>
```

- [x] **Step 3: 在麦理浩径段前插入狮子山照片**

插入：

```mdx
<figure className="classic-photo">
	<img src="/uploads/hong-kong-lion-rock-trail-classic.jpg" alt="狮子山郊野公园与九龙城市视角" loading="lazy" decoding="async" />
	<figcaption>麦理浩径第五段属于城市山径体验，不建议雷雨天强行登高。图片：作者 / 许可。</figcaption>
</figure>
```

- [x] **Step 4: 在旺角段前插入街景照片**

插入：

```mdx
<figure className="classic-photo">
	<img src="/uploads/hong-kong-mong-kok-nathan-road-classic.jpg" alt="旺角弥敦道街景与密集招牌" loading="lazy" decoding="async" />
	<figcaption>旺角段重点是信和中心和周边城市密度，不承诺具体店铺库存。图片：作者 / 许可。</figcaption>
</figure>
```

- [x] **Step 5: 在维港 / 天星小轮段前插入渡轮照片**

插入：

```mdx
<figure className="classic-photo">
	<img src="/uploads/hong-kong-star-ferry-classic.jpg" alt="天星小轮穿过维多利亚港" loading="lazy" decoding="async" />
	<figcaption>天星小轮只作为香港内部体验段，返程仍以口岸和东铁线时间为准。图片：作者 / 许可。</figcaption>
</figure>
```

### Task 3: 更新开发日志

**Files:**
- Modify through command: `src/data/devlog.json`

- [x] **Step 1: 使用项目命令新增 devlog**

Run:

```powershell
npm run devlog:add -- --type content --title "补充香港一日游经典照片" --description "为香港一日游文章加入维港、狮子山、旺角和天星小轮相关可复用照片，并补充来源署名" --tags "香港,图片,旅行计划"
```

- [x] **Step 2: 验证最新 devlog**

Run:

```powershell
npm run devlog:latest
```

Expected: 最新 2026-05-17 条目包含“补充香港一日游经典照片”。

### Task 4: 验证、提交和推送

**Files:**
- Validate: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`
- Validate: `public/uploads/*.jpg`

- [x] **Step 1: 构建验证**

Run:

```powershell
npm run build
```

Expected: Astro build exits 0 and article route builds.

- [x] **Step 2: 现有测试验证**

Run:

```powershell
node --test tests\bot-public-profile.test.mjs
```

Expected: 7 tests pass, 0 fail.

- [x] **Step 3: 检查图片引用**

Run:

```powershell
Select-String -Path dist\blog\2026-05-17-hong-kong-one-day-plan\index.html -Pattern "classic-photo|hong-kong-victoria-harbour-classic|hong-kong-lion-rock-trail-classic|hong-kong-mong-kok-nathan-road-classic|hong-kong-star-ferry-classic"
```

Expected: 输出包含四张图片和 `classic-photo`。

- [x] **Step 4: 提交并推送**

Run:

```powershell
git status -sb
git add src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx src/data/devlog.json public/uploads/hong-kong-victoria-harbour-classic.jpg public/uploads/hong-kong-lion-rock-trail-classic.jpg public/uploads/hong-kong-mong-kok-nathan-road-classic.jpg public/uploads/hong-kong-star-ferry-classic.jpg docs/superpowers/plans/2026-05-17-hong-kong-classic-photos.md
git commit -m "content: add classic hong kong photos"
git push origin main
```

Expected: Push succeeds and local `main` matches `origin/main`.

### Self-Review

- [x] 覆盖用户要求：在博客中插入相关经典照片。
- [x] 不改全站样式、不改博客系统、不改首页。
- [x] 图片本地托管并带来源署名，避免热链和版权不明。
- [x] 保持移动端自然全宽显示，使用 `loading="lazy"`。
- [x] 包含 build、现有测试、devlog 和推送验证步骤。
