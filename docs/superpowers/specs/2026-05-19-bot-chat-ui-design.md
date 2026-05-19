# Bot Chat UI Design

## Goal

Optimize the public `/bot` page so the chat feels like a real conversation instead of a plain text log. The update should make visitor and public-bot messages visually distinct, add keyboard sending, and keep the existing public-only security boundary intact.

## Current Context

The existing public bot page lives in `src/pages/bot.astro`. It already renders the site shell, the `公开分身` title, a visitor-mode tab, a disabled owner-mode tab, a message panel, a textarea composer, and a client-side submit handler that posts to `/api/bot/public`.

The current UI uses separate message blocks, but the screenshot shows the conversation reading as a flat text stack. The main usability gaps are:

- Visitor and assistant turns are not distinct enough at a glance.
- The textarea does not send on Enter.
- The composer does not explain the keyboard behavior.
- The large conversation surface feels under-structured on desktop.

The API, public prompt, and private-memory boundaries are already covered by the earlier public bot design. This design changes only the front-end chat surface and client-side input interaction.

## Approved Direction

Use a left/right chat bubble layout.

- Public bot messages appear on the left.
- Visitor messages appear on the right.
- Each message shows a compact role marker and role label.
- The initial assistant greeting remains `直接问就行。`, but it appears as a public-bot bubble.
- Visitor bubbles use the site accent color.
- Public-bot bubbles use the neutral site surface colors.

This direction was chosen over a two-column identity layout and a log-style list because it gives the clearest turn-taking while preserving a familiar chat interaction model.

## Interaction Design

The textarea submit rules should match common chat applications:

- `Enter` sends the current message.
- `Shift+Enter` inserts a newline.
- During IME composition, such as Chinese input method candidate selection, `Enter` must not send.
- Button click still submits the form.
- Empty trimmed input does nothing.
- While waiting for the API, the send button is disabled and the status line shows `正在生成...`.
- After success or failure, focus returns to the textarea.

The implementation should listen for `keydown` on the textarea and submit the form programmatically only when:

- `event.key === 'Enter'`
- `event.shiftKey` is false
- composition is not active
- the textarea value has non-whitespace content
- the send button is not disabled

Composition state should be tracked with `compositionstart` and `compositionend`, and `event.isComposing` should also be respected.

## Visual Design

The page keeps the existing header, footer, page title, and mode tabs. The chat panel becomes more structured:

- The message area uses a vertical list with stable spacing.
- Each turn is a `.message-row` aligned left or right by `data-role`.
- A small avatar marker sits beside each bubble:
  - `分` for the public bot.
  - `你` for the visitor.
- The label above or inside each bubble reads `公开分身` or `你`.
- Public-bot bubbles use `var(--surface)` or `var(--surface-soft)` with `var(--color-card-border)`.
- Visitor bubbles use `var(--color-accent)` with readable foreground text.
- Bubbles use asymmetric corner radii so the tail side is visually implied without drawing extra shapes.
- Long text wraps safely with `white-space: pre-wrap` and `overflow-wrap: anywhere`.

The composer should stay efficient:

- Desktop: textarea and send button stay in one row.
- Mobile: textarea and button may stack, with the send button full width.
- A compact hint line says `Enter 发送 · Shift+Enter 换行`.
- Status text remains near the send control and does not shift the message panel.

## Components And Files

- `src/pages/bot.astro`
  - Update the inline styles for chat rows, bubbles, labels, avatar markers, composer hint, and responsive behavior.
  - Update the initial assistant message markup to use the new row/bubble structure.
  - Update `appendMessage(role, text)` to create the new message row DOM structure with plain `textContent`.
  - Add textarea key handling for Enter send and Shift+Enter newline.
  - Track IME composition state.

- `src/data/devlog.json`
  - Add a style entry through `npm run devlog:add` during implementation.

No changes are planned for:

- `api/bot/public.js`
- `src/lib/bot/publicProfile.js`
- `tests/bot-public-profile.test.mjs`
- private or owner-mode services
- Vercel, Cloudflare, Decap CMS, or OAuth configuration

## Data Flow

The data flow remains unchanged:

1. Visitor types a message on `/bot`.
2. Browser appends the visitor bubble locally.
3. Browser posts `{ message }` to `/api/bot/public`.
4. API returns `{ answer }`.
5. Browser appends the public-bot bubble.

All displayed user and assistant text must continue to be inserted with `textContent`, not `innerHTML`.

## Error Handling

Existing request error behavior should be kept, but rendered with the new bubble structure:

- On API error, append a public-bot bubble saying `这次没有生成成功，稍后再试。`
- Set the status line to the returned error message when available.
- Keep the visitor's submitted message visible.
- Re-enable the send button and return focus to the textarea.

## Accessibility

- Preserve `aria-live="polite"` on the message list.
- Keep the textarea associated with the form through its `name` and `id`.
- Keep button text visible as `发送`.
- Role labels must be visible text, not color-only distinction.
- Keyboard sending must not block multiline input because `Shift+Enter` remains available.

## Testing

Implementation should be verified with:

- `node --test tests/bot-public-profile.test.mjs`
- `npm run build`
- Browser check of `/bot` on desktop width:
  - public-bot bubble left, visitor bubble right
  - Enter sends
  - Shift+Enter creates a newline
  - request loading state is visible
- Browser check of `/bot` on mobile width:
  - no overlapping text
  - composer remains usable
  - send button is reachable

## Out Of Scope

- Streaming model responses.
- Persisting chat history.
- Adding authentication or owner mode.
- Changing the public prompt.
- Changing the Vercel API contract.
- Editing existing Markdown article content.

## Spec Review

- Placeholder scan: no TBD or TODO items remain.
- Scope check: this is a focused front-end UI and interaction update for one Astro page.
- Consistency check: the design keeps the existing public API and private-memory boundary unchanged.
- Ambiguity check: keyboard behavior is explicit: Enter sends, Shift+Enter inserts a newline, IME composition does not send.
