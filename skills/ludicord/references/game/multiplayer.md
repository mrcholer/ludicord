# Multiplayer Game Architecture

Load only for a game that actually has shared competitive/cooperative gameplay.
For non-game multi-user work, use the collaborative/realtime references instead.

## Default trusted action flow

```text
client input
→ action request
→ server validates identity + game rules + revision
→ authoritative state transition
→ revision/result
→ broadcast
→ clients render
```

## Required questions

- What state is authoritative?
- What actions can be repeated safely?
- How are duplicate/stale/out-of-order actions handled?
- What happens when two actions race?
- What does a reconnecting player receive?
- Can a late join happen?
- What happens when a player disconnects mid-turn/mid-round?
- Is optimistic UI safe for this action?
- Does state survive server restart?

## Client trust

Never trust the client to declare a legal move, score, currency result, winner,
or protected transition when cheating or inconsistency matters. The client may
propose an action; trusted rules validate it.

## Synchronization

Prefer state snapshots/revisions or domain operations with explicit ordering
semantics over broadcasting arbitrary UI state. Reconnect should reconstruct
current trusted state rather than hoping no events were missed.
