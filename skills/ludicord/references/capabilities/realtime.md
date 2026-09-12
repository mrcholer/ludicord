# Realtime Capability

Use realtime when the product requires live bidirectional synchronization, not
because WebSockets are available.

Read [`../server-routes.md`](../server-routes.md) for the verified Ludicord WS
API and Activity-room semantics.

## Decide first

```text
What changes live?
Who publishes the change?
Who receives it?
Does ordering matter?
Does delivery need acknowledgement?
Can the action be retried?
What happens after disconnect?
What is authoritative?
What survives a process restart?
```

## Rules

- Realtime does not imply game.
- Realtime does not imply server-authoritative state; authority depends on the
  invariants being protected. However, trusted shared mutations often need
  server validation.
- Use acknowledgements when UI needs confirmation that a matched server handler
  completed; do not mistake ack for a durable transaction or idempotency.
- Do not assume messages buffer while disconnected.
- Reconnect must define how current state is recovered when missed messages
  matter.
- Module memory is disposable. Durable or multi-replica state needs an
  appropriate application-owned store/adapter.
- Minimize event volume and payload size; do not stream state that can be
  derived locally.

## Common patterns

### Live notification/status

Server event → client updates local/query state. No game architecture needed.

### Collaborative mutation

Client proposes operation → server validates/orders/applies → revision/update
broadcast → clients reconcile.

### Authoritative game action

Use the same transport pattern, but activate game architecture because the
**product** is a game, not because the transport is realtime.
