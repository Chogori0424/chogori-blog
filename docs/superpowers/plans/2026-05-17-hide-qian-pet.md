# Hide Qian Pet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Temporarily hide the global floating Qian pet while keeping the `/bot` page and navigation entry available.

**Architecture:** Remove the `QianPet` component mount from the shared `Header.astro` so pages no longer emit the pet DOM, script, or styles. Keep `src/components/QianPet.astro` untouched so the pet can be restored later by re-adding the import and component mount.

**Tech Stack:** Astro 6, project devlog tooling, npm build verification.

---

## File Structure

- Modify `src/components/Header.astro`: remove the unused `QianPet` import and the `<QianPet />` mount after the header.
- Modify `src/data/devlog.json`: append a devlog entry through `npm run devlog:add`.
- Do not modify `src/components/QianPet.astro`: keep the implementation available for future reopening.
- Do not modify `src/pages/bot.astro`: keep the public bot page available.

## Task 1: Remove The Global Pet Mount

**Files:**
- Modify: `src/components/Header.astro:1-31`

- [x] **Step 1: Confirm the current mount points**

Run:

```powershell
rg -n "QianPet|<QianPet />|qian-pet" src\components\Header.astro src\components\QianPet.astro
```

Expected: `src/components/Header.astro` contains both `import QianPet from './QianPet.astro';` and `<QianPet />`; `src/components/QianPet.astro` still contains the pet implementation.

- [x] **Step 2: Update `Header.astro`**

Edit `src/components/Header.astro` so the top section becomes:

```astro
---
import { SITE_TITLE } from '../consts';
import Avatar from './Avatar.astro';
import HeaderLink from './HeaderLink.astro';
import ScrollMemoryButton from './ScrollMemoryButton.astro';
import ThemeToggle from './ThemeToggle.astro';
---
```

Edit the markup after `</header>` so it becomes:

```astro
</header>
<ScrollMemoryButton />
<style>
```

This removes only the floating pet from the shared layout. It leaves the header navigation, theme toggle, scroll memory button, `/bot` link, and `QianPet.astro` component file intact.

- [x] **Step 3: Verify the Header no longer mounts the pet**

Run:

```powershell
rg -n "QianPet|<QianPet />" src\components\Header.astro
```

Expected: no matches and exit code `1`.

Run:

```powershell
rg -n "QianPet|qian-pet" src\components\QianPet.astro
```

Expected: matches remain in `src/components/QianPet.astro`, confirming the component was preserved for later restoration.

## Task 2: Update Devlog And Verify Build

**Files:**
- Modify: `src/data/devlog.json`

- [x] **Step 1: Add the devlog entry**

Run:

```powershell
npm run devlog:add -- --type removed --title "暂时隐藏倩小宠物" --description "移除全站 Header 中的浮动宠物挂载，保留组件文件待后续完善后恢复。"
```

Expected: `src/data/devlog.json` gains one `removed` entry for the current date. Existing unrelated devlog edits must remain intact.

- [x] **Step 2: Inspect the latest devlog entries**

Run:

```powershell
npm run devlog:latest
```

Expected: the newest entries include `暂时隐藏倩小宠物`.

- [x] **Step 3: Build the site**

Run:

```powershell
npm run build
```

Expected: Astro build completes successfully.

- [x] **Step 4: Confirm only expected files changed**

Run:

```powershell
git status --short
```

Expected: this task's expected changes are `src/components/Header.astro`, `src/data/devlog.json`, and this plan file.

## Self-Review

- Spec coverage: the plan hides only the global floating `QianPet`, preserves `/bot`, preserves the nav entry, and keeps `QianPet.astro` for future restoration.
- Placeholder scan: no incomplete markers or unspecified implementation steps remain.
- Type and path consistency: all paths match the current Astro project structure under `C:\Users\16354\Documents\chogori-blog`.
