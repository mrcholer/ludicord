# Capability Routing

Capabilities are orthogonal to product type. Select each one independently.

## Decision table

| Need | Capability / reference |
| --- | --- |
| Local input, modal, selection, derived UI | React state; see [`../react-state.md`](../react-state.md) |
| Persist small client data by supported Activity scope | Persistence; see [`../capabilities/persistence.md`](../capabilities/persistence.md) |
| Server read/write or authorization | API routes; see [`../server-routes.md`](../server-routes.md) |
| Live bidirectional updates | Realtime; see [`../capabilities/realtime.md`](../capabilities/realtime.md) |
| User/guild/channel/participant/voice/layout context | Discord context; see [`../capabilities/discord-context.md`](../capabilities/discord-context.md) |
| Secrets, identity, sessions, privileged data | [`../auth-security.md`](../auth-security.md) |
| Embed navigation or automatic UI files | [`../embeds-navigation.md`](../embeds-navigation.md) |
| Production/runtime/config | [`../config-deploy.md`](../config-deploy.md) |

## Questions to answer before selecting a capability

### Realtime

Use realtime only when stale data until the next request materially harms the
experience. Presence, shared controls, collaborative editing, and live game
state often need it; static settings and ordinary forms often do not.

### Persistence

Ask what must survive:

```text
render?
embed navigation?
Activity relaunch?
server restart?
process replica?
days/months?
```

The answer determines the storage layer. Convenience is not a lifetime model.

### Authority

Server authority is required when accepting a client decision would allow the
client to violate permissions, money/entitlement rules, competitive rules,
shared document invariants, or other trusted state. Server authority is not
limited to games.

### Discord context

Do not load participant, guild, channel, member, role, voice, or layout data
unless the feature uses it. Discord context is useful product data, not a box
to tick for every Activity.

## Prohibited shortcut reasoning

Never reason like this:

```text
It has two users → WebSocket → multiplayer → game architecture
```

Reason like this instead:

```text
Two users edit the same artifact
→ collaborative product
→ changes must appear live
→ realtime capability
→ decide authority/conflict strategy from artifact semantics
```
