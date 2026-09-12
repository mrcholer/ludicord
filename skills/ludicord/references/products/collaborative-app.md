# Collaborative App Product Profile

Activate when multiple participants work on, control, review, or coordinate
around the same artifact or task.

Examples: shared whiteboard, collaborative editor, planning board, synchronized
control surface, shared poll builder, group queue, or co-browsing state.

## First questions

```text
What is the shared artifact?
Who may mutate it?
What can be edited concurrently?
What ordering matters?
What survives disconnect/restart?
What happens on conflicting edits?
```

## Rules

- Collaboration is not automatically a game.
- Realtime is common but still a capability decision.
- Decide authority from data invariants, not from the word "multiplayer".
- Define reconnect behavior before adding visual presence polish.
- For concurrent mutations, define ordering/version/conflict semantics rather
  than accepting last-write-wins accidentally.
- Presence avatars/cursors are optional; the shared task comes first.
- Durable history is optional; do not add it unless the product needs it.

## Validation

Test two participants, stale state, reconnect, duplicate actions/events,
permission boundaries, and late joins when those cases apply.
