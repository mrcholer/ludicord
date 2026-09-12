# Dashboard Product Profile

Activate when the core experience is management, operations, moderation,
configuration, analytics, administration, or data-heavy workflow.

## Experience priorities

```text
critical status
→ primary actions
→ filters/search
→ operational data
→ details/history
```

## Rules

- Optimize for scanability and repeat actions, not marketing presentation.
- Use tables/lists/cards/charts only when they fit the data; do not force every
  dashboard pattern into every screen.
- Make destructive actions explicit and recoverable where possible.
- Model loading, empty, partial-error, permission, and stale-data states.
- Keep permissions and trusted mutations on the server.
- Realtime updates are optional. Use them only when delayed information harms
  operations.
- Do not add gamification, scores, achievements, or multiplayer architecture
  unless explicitly requested.

## Ludicord mapping

Use API/WS/auth/state references only for capabilities the dashboard needs.
Discord guild/member/role data may be relevant to moderation/management, but
privileged data and bot-token operations remain server-side.
