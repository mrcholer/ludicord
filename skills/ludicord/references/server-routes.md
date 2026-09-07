# API Routes, WebSockets, and Activity Rooms

Read [API routes](https://github.com/mrcholer/ludicord/blob/main/docs/api-routes.md),
[WebSockets](https://github.com/mrcholer/ludicord/blob/main/docs/websockets.md),
[Activity rooms](https://github.com/mrcholer/ludicord/blob/main/docs/activity-rooms.md), and the
[development runtime](https://github.com/mrcholer/ludicord/blob/main/docs/development.md) for the full guides.

## API routes

Create `app/api/<route>/route.ts` with native `Request`/`Response` handlers:

```ts
// Correct: app/api/hello/route.ts
import type { LudicordRequest } from "ludicord/server";

export function GET(request: LudicordRequest) {
  return Response.json({ user: request.ludicord?.user });
}
```

- Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, or `OPTIONS`.
- Ludicord adds `request.params` (typed dynamic segments), `request.ludicord`
  (verified session context), and `request.verification`.
- Dynamic directories (`[id]`, `[...slug]`, `[[...slug]]`) create typed
  parameters; duplicate patterns are rejected.
- Routes require a valid Ludicord session by default. For intentionally
  public data only:

```ts
// Correct: explicitly public health endpoint.
export const auth = false;

export function GET() {
  return Response.json({ ok: true });
}
```

```ts
// Wrong: trusting client-supplied identity.
export function POST(request: LudicordRequest) {
  const { userId, guildId } = await request.json(); // never trust these
  return Response.json({ userId, guildId });
}
```

Authenticated handlers trust identity from `request.ludicord`, never user or
guild IDs from a request body. Validate request bodies and authorization on
the server.

Framework behaviour: 404 for no route, 405 with `Allow` for unsupported
methods, HEAD supplied from GET, OPTIONS supplied when no custom handler
exists. API and Activity traffic share one Node server.

Server-only helpers live in `ludicord/server` (`getLudicordSession`,
`requireLudicordSession`) and `ludicord/security` (Discord verification).
Neither belongs in browser components. Keep testing utilities from
`ludicord/testing` out of production bundles; `ludicord/internal` is
compiler-owned.

## WebSockets

Create `app/ws/<route>/route.ts` with the documented server helper:

```ts
// Correct: app/ws/presence/route.ts
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

Connect from React with the explicit client entry point (not the mixed
`ludicord/ws` barrel in browser code):

```tsx
// Correct
import { useWS } from "ludicord/ws/client";

const ws = useWS("/ws/presence");

useEffect(() => ws.on("echo", handleEcho), [ws]); // on() returns unsubscribe
if (ws.status === "open") ws.emit("ping", payload); // emit only when open
```

- Connections require a valid Ludicord session.
- `useWS(route, options)` returns `status` (`connecting`, `open`,
  `reconnecting`, `closed`, `error`), `emit`, `on`, `off`, `close`, and
  `reconnect`, with bounded exponential reconnection.
- Register listeners in an effect and return the cleanup. Messages are not
  buffered while disconnected.
- The wire protocol uses versioned JSON event envelopes. Ludicord rejects
  malformed messages and reserved internal event names, limits payload size
  and backpressure, sends heartbeat pings, and cleans up clients and rooms
  on disconnect.
- All WebSocket upgrades share the Activity HTTP server; no second port.

## Activity rooms

Every authenticated WebSocket client can join the Activity Instance room:

```ts
// Correct
connect(client) {
  client.activity.join();
  client.activity.broadcast("joined", {
    userId: client.ludicord.user.id,
  });
}
```

- Room identity combines the WebSocket route namespace, Discord application
  ID, and Activity instance ID — two instances of the same Activity are
  isolated from each other.
- A broadcast never trusts a client-provided application or instance
  identifier; those values come from the encrypted server session.
- Leave/broadcast behaviour is also available in `disconnect`. Ludicord
  removes all room membership when a socket closes, fails heartbeat checks,
  or violates payload/backpressure limits.

## Development hot-replacement semantics

Saving an API/WS route or one of its local imports rebuilds the shared
server module graph in place. The HTTP process and port keep running:

- Existing sockets close with code 1012 and reconnect on the configured
  backoff; the new handler is active after compilation succeeds.
- A failed compile keeps the last working graph and displays its error —
  fix the source and let the terminal compilation recover.
- Adding/removing routes refreshes manifests and generated types
  automatically.
- Server module-level memory resets when the graph is replaced and never
  spans replicas. Use a database or external store for persistent or
  multi-instance state.
- Browser embed edits use React Refresh and normally preserve component
  state when hook signatures stay compatible.
- Restart dev only for configuration, environment, dependency, or OAuth
  scope changes — never for normal route or embed edits.
