# Codex Project Rules

## Development Log

- Every Codex change that adds a feature, fixes a bug, improves styles, changes deployment/build configuration, updates content systems, or refactors project structure must update `src/data/devlog.json` before commit.
- Use `npm run devlog:add -- --type <type> --title "<title>" --description "<description>" --tags "tag-a,tag-b"` when adding a new development log entry.
- Supported devlog types are `feature`, `fix`, `style`, `content`, `deploy`, and `refactor`.

## Verification

- Run `npm run build` before every commit.
- Check `git status` before committing so unrelated files are not included.

## Safety

- Do not commit tokens, cookies, `.env`, `.env.*`, `.vercel`, `node_modules`, or `dist`.
- Do not modify Cloudflare, Vercel, GitHub OAuth, or Decap CMS configuration unless the user explicitly asks for it.
- Do not change existing Markdown article content unless the user explicitly asks for a content edit.
