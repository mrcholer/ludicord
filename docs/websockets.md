# WebSockets

> Documentation for Ludicord 3.1.0. See [release status](../releases/README.md).


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

Connect from React with `useWS("/ws/presence")` from `ludicord/ws/client`. Connections require a valid Ludicord session. The client exposes `status`, `emit`, `on`, `off`, `close`, and `reconnect` with bounded exponential reconnection.

The wire protocol uses versioned JSON event envelopes. Ludicord rejects malformed messages and reserved internal event names, limits payload size and backpressure, sends heartbeat pings, and cleans up clients and rooms on disconnect. All WebSocket upgrades share the Activity HTTP server; no second port is created.
