# NotebookLM Career AI Learning Guide Design

## Goal

Add a detailed Chinese blog article about using NotebookLM as a practical career and AI-learning workspace, with special focus on resume optimization, vibe coding, and AI Agent learning.

The article should be useful as a hands-on guide rather than a generic product introduction. It should explain the core NotebookLM workflow, then turn that workflow into reusable systems for job applications, coding-assisted learning, and Agent study.

This spec is design-only. It defines the approved content direction and implementation boundaries before article and code changes.

## Current Context

The active project root is `C:\Users\16354\Documents\chogori-blog`.

Relevant project files:

- `src/content/blog/*.{md,mdx}` contains Markdown and MDX blog posts.
- `src/content.config.ts` validates blog frontmatter and currently allows four categories.
- `src/consts.ts` defines `BLOG_CATEGORIES`, category slugs, and category descriptions used by the homepage, blog index, and category pages.
- `src/components/PostCard.astro` maps categories to gradient cover styles.
- `src/pages/categories/index.astro` has category page metadata that currently names the existing category set.
- `src/data/devlog.json` must be updated for content changes through the repo's development-log workflow.

The current category set is `网络代理`, `工程制造`, `音频设备`, and `个人日志`. The user approved adding a new `AI 工具` category for this article and future AI-tool writing.

## Source Basis

The article should reference current official NotebookLM behavior from Google sources during implementation:

- NotebookLM is described by Google as an AI-powered research assistant that works from uploaded sources, supports chat with citations, and can transform sources into study guides, briefings, audio overviews, mind maps, and other formats.
- Google Help documents the basic notebook model: create a notebook, add sources, then use the Chat and Studio panels.
- Google Help documents supported source types including PDFs, websites, YouTube URLs, audio files, Google Docs, Google Slides, Microsoft Word, text, Markdown, images, Google Sheets, and pasted text.
- Google Help documents Studio outputs including notes, Audio Overviews, Video Overviews, Mind Maps, reports, data tables, flashcards, quizzes, slide decks, and infographics.

Implementation should avoid presenting volatile feature details as permanent. Where exact feature availability matters, phrase it as "当前官方说明中支持" and keep the emphasis on workflows that remain useful even if individual Studio artifacts change.

Official source URLs to consult:

- https://support.google.com/notebooklm/answer/16164461
- https://support.google.com/notebooklm/answer/16206563
- https://support.google.com/notebooklm/answer/16215270
- https://support.google.com/notebooklm/answer/16212820

## Approved Approach

Use the combined approach approved by the user: practical guide plus career-growth framework.

The article should:

- Start with what NotebookLM is good at: source-grounded reading, synthesis, comparison, study planning, and output generation.
- Keep the core value clear: NotebookLM is more useful when each notebook has a specific task boundary and high-quality sources.
- Make resume optimization the first major use case because it is the most concrete and high-value.
- Treat vibe coding as a learning workflow, not as a claim that AI replaces engineering fundamentals.
- Treat AI Agent learning as a structured research path: concepts, frameworks, examples, evaluation, memory, tools, and experiments.
- Include reusable prompt templates in Chinese.
- Include limitations and safety notes: do not upload sensitive private data unnecessarily, do not fabricate resume content, verify citations and generated claims, and use NotebookLM as a learning assistant rather than a substitute for real projects.

## Content Design

Create a new post:

- File: `src/content/blog/notebooklm-career-ai-learning-guide.md`
- Title: `NotebookLM 使用说明：从简历优化到 vibe coding 与 AI Agent 学习`
- Category: `AI 工具`
- Tags: `NotebookLM`, `AI 工具`, `简历优化`, `Vibe Coding`, `AI Agent`, `学习方法`
- Publication date: `2026-05-13`
- Hero image: reuse an existing blog placeholder image so no new asset work is required.

Target length: roughly 4,500 to 6,500 Chinese characters. The piece should be detailed enough to include workflows and prompts, but not padded with product-marketing copy.

Recommended article outline:

1. `NotebookLM 适合解决什么问题`
   - Explain the difference between source-grounded notebook work and open-ended chat.
   - Define good source inputs: resume, JD, project notes, tutorials, docs, papers, videos, and error logs.

2. `基础使用流程`
   - Create a notebook.
   - Add sources.
   - Use Chat for cited questions.
   - Use Studio for briefing, study guide, mind map, audio/video overview, data table, flashcards, quiz, slides, or infographic when useful.

3. `一个 notebook 一个任务边界`
   - Recommend separate notebooks for resume optimization, target roles, portfolio projects, vibe coding, and AI Agent learning.
   - Explain why mixed sources make retrieval and answers less precise.

4. `简历制作与优化工作流`
   - Inputs: existing resume, target JD, project notes, skill list, achievement rough notes.
   - Steps: extract requirements, compare resume/JD fit, rewrite project bullets, quantify impact, check ATS keywords, prepare interview questions.
   - Include prompt templates for JD matching, bullet rewriting, missing evidence, and interview preparation.

5. `vibe coding 学习工作流`
   - Inputs: framework docs, tutorial URLs, README files, issue notes, error logs, personal project notes.
   - Steps: build a concept map, ask why errors happen, convert debugging notes into reusable rules, generate project retrospectives.
   - Keep the tone disciplined: AI can speed exploration, but the learner must still run code, inspect failures, and write down decisions.

6. `AI Agent 学习工作流`
   - Inputs: Agent framework docs, tool-calling examples, RAG notes, workflow diagrams, evaluation articles, memory design notes.
   - Steps: build terminology, compare architectures, list minimal experiments, generate flashcards/quizzes, and create a study roadmap.
   - Include prompts for framework comparison, experiment planning, and concept explanation.

7. `高质量提问模板`
   - Provide grouped prompt templates:
     - Resume and JD fit.
     - Project experience rewriting.
     - Coding concept explanation.
     - Debugging record synthesis.
     - Agent framework comparison.
     - Weekly learning plan.

8. `限制与注意事项`
   - Use citations but verify important facts.
   - Do not upload unnecessary sensitive personal data.
   - Do not invent resume achievements.
   - Do not treat generated learning paths as proof of mastery.
   - Keep source libraries clean and periodically split notebooks when a topic grows too broad.

9. `我的推荐用法`
   - Close with a repeatable loop: collect sources, ask narrow questions, generate structured outputs, test in real work, then feed the notes back into the notebook.

## Category Design

Add the new `AI 工具` category in all category systems:

- Add `AI 工具` to the frontmatter enum in `src/content.config.ts`.
- Add a `BLOG_CATEGORIES` item in `src/consts.ts`:
  - `name`: `AI 工具`
  - `slug`: `ai-tools`
  - `description`: `NotebookLM、AI 编程、Agent 学习和个人知识工作流。`
- Add an `AI 工具` mapping in `src/components/PostCard.astro` so category cards have a deliberate gradient rather than falling back to the default style.
- Update `src/pages/categories/index.astro` metadata description so it includes the new category.

No navigation restructuring is required because category navigation is generated from `BLOG_CATEGORIES`.

## Files In Scope

- `src/content/blog/notebooklm-career-ai-learning-guide.md`
- `src/content.config.ts`
- `src/consts.ts`
- `src/components/PostCard.astro`
- `src/pages/categories/index.astro`
- `src/data/devlog.json`

Out of scope:

- No Cloudflare, Vercel, GitHub OAuth, or Decap CMS configuration changes.
- No layout redesign.
- No unrelated edits to existing article content.
- No new image generation or asset pipeline changes.

## Verification

Implementation verification should include:

- Run `npm run devlog:add` to record the content/category addition.
- Run `npm run devlog:latest` to confirm the newest development-log entry.
- Run `npm run build` to validate Astro content schema, category routes, RSS generation, and Markdown rendering.
- Check `git status --short` before committing so only intended files are included.

## Success Criteria

- The new post builds successfully and appears under `/blog/notebooklm-career-ai-learning-guide/`.
- The `AI 工具` category appears in category navigation and category pages with the slug `/categories/ai-tools/`.
- The article gives concrete NotebookLM workflows for resume optimization, vibe coding learning, and AI Agent learning.
- The article includes practical prompt templates and responsible-use warnings.
- The development log records the content addition.
