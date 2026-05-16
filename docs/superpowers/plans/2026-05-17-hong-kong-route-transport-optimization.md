# 香港一日游交通路线优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 更新香港一日游文章，使其明确推荐过关口岸、综合比较高铁/地铁/巴士/轮渡，并加入更多顺路著名景点和更贴近真实移动路径的曲线路线图。

**Architecture:** 保持现有 Astro 内容系统不变，只修改 MDX 文章、静态 PNG 地图资产和开发日志。路线图继续使用 OpenStreetMap tiles 生成本地图片，但曲线通过多个中间点拟合深圳地铁、东铁线、九龙市区、天星小轮和返程方向。

**Tech Stack:** Astro 6、MDX、OpenStreetMap 静态 tiles、Python/Pillow 生成图片、项目现有 `devlog:add` 和 `astro build`。

---

### Task 1: 更新真实路线图

**Files:**
- Modify: `public/uploads/hong-kong-one-day-route-map.png`

- [ ] **Step 1: 重新生成地图图片**

使用 bundled Python/Pillow 拉取 OpenStreetMap tiles，生成 1400x960 PNG。标注点包括：宝龙地铁站、罗湖口岸、福田口岸、黄大仙祠、南莲园池/志莲净苑、彩虹邨、麦理浩径五段压缩段、旺角信和中心、油麻地/庙街、尖沙咀维港/钟楼、中环天星码头、金钟返程。

曲线路径使用多段中间点：
- 深圳段：宝龙 → 横岗/布吉方向 → 罗湖。
- 香港主线：罗湖 → 上水 → 大埔 → 沙田 → 九龙塘 → 黄大仙 → 钻石山 → 沙田坳道/麦理浩径 → 九龙塘/旺角 → 油麻地 → 尖沙咀 → 中环天星码头 → 金钟 → 东铁线走廊 → 罗湖。
- 福田备选：宝龙 → 岗厦北/福田 → 落马洲 → 东铁线走廊。

- [ ] **Step 2: 人工查看图片**

运行：

```powershell
Get-Item public\uploads\hong-kong-one-day-route-map.png
```

Expected: 文件存在且大小大于 500KB。

### Task 2: 更新文章内容

**Files:**
- Modify: `src/content/blog/2026-05-17-hong-kong-one-day-plan.mdx`

- [ ] **Step 1: 更新交通结论**

在行程结论和口岸对比部分写清：
- 罗湖口岸为首选。
- 福田口岸/落马洲支线为签注点或导航更顺时的备选。
- 高铁不作为主线，原因是会把路线拉到西九龙，不利于黄大仙/麦理浩径。
- 跨境巴士不作为主线，原因是灵活性和换乘不如港铁。
- 跨境轮渡不作为主线，原因是宝龙到蛇口绕路；但天星小轮适合作为维港体验。

- [ ] **Step 2: 增加顺路景点**

在主路线中加入：
- 黄大仙祠：短停 20-30 分钟。
- 南莲园池/志莲净苑：天气或体力缓冲，也可作为雨天替代。
- 彩虹邨：可选短停，不占用主线。
- 油麻地/庙街：晚餐或快走经过。
- 尖沙咀钟楼/1881 Heritage：维港前后顺路。
- 天星小轮：尖沙咀到中环，用作维港体验。

- [ ] **Step 3: 更新时间线和返程策略**

把时间线调整为：
- 09:00-10:30 宝龙 → 签注点/罗湖方向。
- 10:30-12:00 签注与过关。
- 12:00-13:20 黄大仙祠、南莲园池/志莲净苑或彩虹邨可选。
- 13:20-15:30 麦理浩径五段压缩段。
- 15:30-18:30 旺角信和中心，油麻地/庙街作为可选补点。
- 18:30-20:40 尖沙咀钟楼、星光大道、维港、天星小轮到中环。
- 20:40-21:30 从中环/金钟接东铁线返深。

- [ ] **Step 4: 增加参考信息**

在文章末尾增加“参考信息”模块，链接到香港入境处、MTR、天星小轮、南莲园池和香港旅发局黄大仙页面。

### Task 3: 更新开发日志并验证

**Files:**
- Modify: `src/data/devlog.json`

- [ ] **Step 1: 新增 devlog**

Run:

```powershell
npm run devlog:add -- --type content --title "优化香港一日游交通与路线图" --description "补充罗湖优先的过关推荐、高铁地铁巴士轮渡比较、顺路景点和更贴近真实行程的曲线路线图" --tags "香港,交通规划,路线图"
```

Expected: 输出 `Added changelog item`。

- [ ] **Step 2: 构建验证**

Run:

```powershell
npm run build
```

Expected: exit 0，并生成 `/blog/2026-05-17-hong-kong-one-day-plan/index.html`。

- [ ] **Step 3: 测试验证**

Run:

```powershell
node --test tests\bot-public-profile.test.mjs
```

Expected: 7 tests, 0 failures。

- [ ] **Step 4: 预览验证**

访问：

```text
http://127.0.0.1:4321/blog/2026-05-17-hong-kong-one-day-plan/
http://127.0.0.1:4321/uploads/hong-kong-one-day-route-map.png
```

Expected: 两个 URL 都返回 200。
