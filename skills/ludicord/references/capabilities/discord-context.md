# Discord Context Capability

Use Discord context only when the feature depends on Discord user, guild,
channel, participant, voice, role/member, layout, command, entitlement, or SDK
behavior.

Read [`../discord-data.md`](../discord-data.md) and
[`../auth-security.md`](../auth-security.md) before implementation.

## Rules

- Treat context fields as potentially unavailable until Discord supplies them.
- Design loading, unavailable, and permission-denied states.
- Do not request or fetch broader Discord data merely to make the UI richer.
- Full member/privileged operations remain server-side with the required bot
  token/intents and authorization checks.
- Discord context can enrich any product profile; it does not determine whether
  the product is a game, dashboard, social app, or utility.
- Layout/mobile/PiP behavior is part of Activity UX when the feature is visible
  there; validate those surfaces when relevant.
