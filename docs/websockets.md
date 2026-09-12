# WebSockets

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


Create `app/ws/presence/route.ts`:

```ts
import { defineWS } from "ludicord/ws/server";

export default defineWS({
  connect(client) {
    client.emit("ready", { userId: client.ludicord.user.id });
  },
  events: {
    ping(client, data) {
      client.emit("pong", data);
    },
  },
});
```

Connect from React with `useWS("/ws/presence")` from `ludicord/ws/client`. Connections require a valid Ludicord session. The client exposes `status`, `emit`, `emitWithAck`, `on`, `off`, `close`, and `reconnect` with bounded exponential reconnection. It reconnects when the Activity becomes visible or returns online after the normal retry budget was exhausted.

Use `emitWithAck()` when the UI must know that the server handler completed:

```tsx
await socket.emitWithAck("save", draft, { timeout: 5_000 });
```

The promise resolves after the handler succeeds. It rejects when the handler rejects, the connection closes, or the acknowledgement times out. This confirms handler completion; it does not replace database transactions or application idempotency keys.

Defaults limit each message to 256 KiB, each client to 120 messages and 512 KiB of inbound data per second, and buffered outbound data to 512 KiB. Slow outbound clients use bounded `queue-latest` coalescing by default; set `websocket.backpressureStrategy` to `"close"` when dropping them is safer. Heartbeats remove dead or expired sessions, and disconnect cleanup removes every room membership.

All WebSocket upgrades share the Activity HTTP server and its host/origin policy. For multiple Node processes, pass a `LudicordWebSocketAdapter` to `createLudicordProductionServer()` for pub/sub and total room counts. A `LudicordSharedStateStore` separately provides atomic revisions to `defineSharedActivityState()` routes.
