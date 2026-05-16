# Public Bot Page Design

## Goal

Add a public, safe chatbot entry to `chogori.xyz` that lets visitors talk with a Chogori-style assistant without exposing private LCX_BOT memory, FAISS indexes, raw chat records, or retrieval context.

## Current Context

The blog is an Astro static site deployed on Vercel at `https://chogori.xyz`. The project already uses root-level Vercel functions under `api/` for Decap CMS GitHub OAuth. Production responses confirm Vercel hosting, and the repo rules require a development-log update plus `npm run build` for feature work.

LCX_BOT is a separate Python project with `faiss-cpu`, `sentence-transformers`, OpenAI client code, profile files, and private derived memory artifacts. Those files must not be copied into the public blog repository or exposed to browser code.

## Approved Product Shape

The long-term target is two modes:

- Visitor mode: public, available on the blog, answers in a restrained Chogori-style voice using only a public persona prompt.
- Owner mode: private, authenticated, allowed to query private LCX_BOT memory through a separate backend service.

This implementation covers the first deployable slice: visitor mode plus a visible but disabled owner-mode placeholder. Owner mode will be a separate follow-up because it needs private service hosting, authentication, and operational secret handling.

## Architecture

Add a static Astro page at `/bot` with a first-screen chat interface. The page posts visitor messages to a Vercel Node function at `/api/bot/public`.

The Vercel function calls the OpenAI-compatible chat completions API directly with server-side environment variables. It never reads `LCX_BOT` files, never loads RAG indexes, and never returns prompt internals or debug context.

The public prompt lives in a small JS helper under `src/lib/bot/` so it can be tested independently from the HTTP handler. It should describe public writing habits and public blog topics only.

## Components

- `src/pages/bot.astro`
  - Owns the visible chat page, client-side form handling, message list, loading state, and error display.
  - Uses `BaseHead`, `Header`, and `Footer` to match the existing site shell.
  - Escapes output by writing through `textContent`, not HTML injection.

- `api/bot/public.js`
  - Accepts `POST` JSON only.
  - Validates message shape and length.
  - Uses `OPENAI_API_KEY`, optional `OPENAI_BASE_URL`, and optional `BOT_PUBLIC_MODEL` or `LCX_BOT_MODEL`.
  - Returns only `{ "answer": "..." }` on success.
  - Returns concise JSON errors without prompt text, raw upstream payloads, or private diagnostics.

- `src/lib/bot/publicProfile.js`
  - Provides input sanitization and message construction for public bot calls.
  - Contains only public persona guidance derived from the visible blog identity and safe style goals.

- `tests/bot-public-profile.test.mjs`
  - Verifies empty input rejection, length limiting, control-character cleanup, and no private-memory wording in public prompt construction.

- `src/components/Header.astro`
  - Adds a navigation link to `/bot` so the page is discoverable.

- `src/data/devlog.json`
  - Updated through `npm run devlog:add` after the feature is implemented.

## Data Flow

1. Visitor opens `/bot`.
2. Browser renders an empty chat surface and focused input.
3. Visitor submits text.
4. Client appends the visitor message locally and calls `POST /api/bot/public`.
5. API validates and sanitizes the message.
6. API builds a public-only system/user message set.
7. API calls the configured OpenAI-compatible endpoint.
8. API returns the assistant answer as JSON.
9. Browser appends the assistant answer as plain text.

## Security Boundaries

- No `LCX_BOT/data`, `LCX_BOT/knowledge_base`, `LCX_BOT/profile`, or private chat export files are copied into the blog.
- Browser code never receives API keys, prompts, memory chunks, context scores, or retrieval metadata.
- Public mode cannot answer private-memory questions from RAG. It may say it cannot access private history.
- API responses use `Cache-Control: no-store`.
- Owner mode is not implemented in this slice; the disabled control prevents implying a private feature is live.

## Error Handling

- Non-POST requests return `405` with `Allow: POST`.
- Invalid JSON or empty messages return `400`.
- Missing `OPENAI_API_KEY` returns `500` with a short configuration error for local/deployment debugging.
- Upstream model failures return `502` with a generic failure message.
- The page shows concise inline errors and keeps the visitor's text in the conversation.

## Testing

- Run `node --test tests/bot-public-profile.test.mjs`.
- Run `npm run build`.
- Run the Astro dev server and verify `/bot` renders.
- With no `OPENAI_API_KEY`, verify the UI shows a controlled error from `/api/bot/public` rather than leaking internals.
- With valid environment variables, verify a simple public message returns a Chogori-style answer.

## Out Of Scope

- Deploying or migrating the Python LCX_BOT service.
- Exposing private memory search on the public blog.
- Adding GitHub OAuth or password auth for owner mode.
- Streaming responses.
- Changing Decap CMS, GitHub OAuth, Vercel project settings, Cloudflare DNS, or existing Markdown article content.

## Spec Review

- Placeholder scan: no placeholder requirements remain.
- Scope check: the implementation is one deployable public-bot slice, with private owner mode explicitly deferred.
- Consistency check: API, page, helper, tests, and devlog responsibilities are separated and do not require copying LCX_BOT private artifacts.
