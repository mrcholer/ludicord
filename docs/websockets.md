# WebSockets

> Documentation for Ludicord 4.2.0. See [release status](../releases/README.md).

## Connection recovery and data APIs

The following APIs and recovery controls are available in Ludicord 4.2.0.

Client connections have a 10-second handshake deadline and bounded exponential retries with 20% random delay variation. Failed socket construction, transport errors, and stalled handshakes follow the same retry budget. Set `reconnect.jitter: 0` for deterministic delays. Manual close cancels all connection, retry, and health timers; `reconnect.enabled: false` disables automatic retries and browser-resume recovery.

New clients request a health capability using the framework-owned `ludicord_health=1` query parameter. Only authenticated upgrades advertise support, and health probes do not invoke application handlers. Older clients receive no additional capability messages; newer clients connected to older servers do not send probes. The flag grants no authentication or Activity membership.

Supported servers receive a probe every 15 seconds with a 10-second response deadline. Returning to a visible, online Activity checks an existing open connection as well. A missing response replaces the stale socket through the existing retry policy. Hidden time does not trigger a health failure. Probes share session, payload, message-rate, and byte-rate protections. Disable probes or tune their interval when an application uses unusually low rate limits.

```tsx
import { useWS, useWSDiagnostics } from "ludicord/ws/client";

const connection = useWS("/ws/presence", {
  connectionTimeout: 10_000,
  healthCheck: { enabled: true, interval: 15_000, timeout: 10_000 },
  reconnect: { enabled: true, attempts: 10, initialDelay: 500, maxDelay: 10_000, jitter: 0.2 },
});
const network = useWSDiagnostics(connection);
// Pass network to your own HUD, connection banner, or logging policy.
```

`useWSDiagnostics()` subscribes to immutable snapshots separately from `useWS()`; ordinary message consumers do not rerender solely because latency changes. For non-reactive reads, use `connection.diagnostics` or `getDiagnostics()`. Non-React connections also expose `subscribeDiagnostics(listener)`, which returns cleanup.

| Field | Meaning |
| --- | --- |
| `status` | Current connection status |
| `connectionAttempts` | Total socket construction attempts, including the initial attempt |
| `reconnectAttempts` | Consecutive retry attempts; resets after a successful connection |
| `reconnectCount` | Successful connections after the first open |
| `nextReconnectDelayMs` | Scheduled retry delay, or `null` |
| `latencyMs` | Most recent round-trip probe time; `null` before a valid response and after disconnect |
| `lastConnectedAt` | Unix milliseconds of the most recent successful open, or `null` |
| `lastErrorCode` | Most recent framework transport or protocol/handler error code; cleared after a successful open |
| `lastClose` | Most recent received close code, reason, and clean-close flag, or `null` |

`LUDICORD9105` identifies handshake timeout, `LUDICORD9106` identifies health timeout, and `LUDICORD9107` identifies transport failure. These APIs mount no UI and send no telemetry. Treat close reasons as text when rendering your own UI. Missed actions are never replayed automatically; applications own idempotency and resynchronization. `useSharedActivityState()` continues subscribing for a fresh snapshot after reconnect.


Create `app/ws/presence/socket.ts` for `/ws/presence`, or `app/live/socket.ts` for `/live`. The `ws/` folder is optional. A directory may contain only one route file. Use the full discovered URL in `useWS()`; no `/ws` prefix is added automatically.

Example:

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
