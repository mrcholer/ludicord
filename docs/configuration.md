# Configuration reference

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).

Create `ludicord.config.mjs` in the application root:

```js
import { defineConfig } from "ludicord/config";

export default defineConfig({
  discord: { scopes: ["identify", "guilds"] },
  activity: { defaultEmbed: "home", outsideDiscord: "error" },
  server: { port: 3000 },
});
```

Client ID may come from `LUDICORD_DISCORD_CLIENT_ID`. Keep secrets in server environment variables, never config literals or client imports.

## Discord and Activity

| Setting | Default | Meaning |
| --- | --- | --- |
| `discord.clientId` | Environment value | Public Discord application ID |
| `discord.scopes` | `["identify"]` | Requested OAuth scopes |
| `discord.auth.required` | `true` | Require login for the Activity |
| `discord.auth.session` | `"encrypted-cookie"` | Supported session mechanism |
| `discord.auth.proxyVerification` | `false` | Enable optional signed-request verification |
| `discord.auth.activityInstanceVerification` | `"auto"` | Verify through REST when a bot token is available; `true` requires it |
| `discord.auth.activityInstanceCacheTtlMs` | `30000` | Bounded successful verification cache |
| `activity.defaultEmbed` | `"home"` | Initial registered embed |
| `activity.outsideDiscord` | `"error"` | `error`, `allow` or `mock` outside Discord |

Allow mode does not fabricate Discord identity. Mock mode is for development/testing, never a substitute for production authentication. Verification requires the relevant server credentials; see [security](security.md).

## HTTP server

| Setting | Default | Meaning |
| --- | --- | --- |
| `server.port` | `3000` | Listening port |
| `server.host` | `"0.0.0.0"` | Listening interface |
| `server.allowedHosts` | `true` | All hosts, or an explicit hostname list |
| `server.allowedOrigins` | `"same-origin"` | Browser origins accepted by HTTP and WebSocket routes |
| `server.limits.body` | `"2mb"` | HTTP request body limit |
| `server.requestTimeout` | `30000` | Maximum API handler duration |
| `server.shutdownTimeout` | `10000` | Graceful shutdown limit |

Use an explicit host list when appropriate. CLI host/port flags override environment values; `HOST` and `PORT` override configured defaults.

## WebSockets

All durations below are milliseconds.

| Setting | Default | Meaning |
| --- | --- | --- |
| `websocket.enabled` | `true` | Enable WebSockets |
| `websocket.heartbeatInterval` | `30000` | Heartbeat interval |
| `websocket.maxPayload` | `262144` | Maximum message size, bytes |
| `websocket.compression` | `false` | Enable compression |
| `websocket.maxMessagesPerSecond` | `120` | Per-client inbound message rate |
| `websocket.maxBytesPerSecond` | `524288` | Per-client inbound byte rate |
| `websocket.backpressureLimit` | `524288` | Buffered bytes before slow-client handling |
| `websocket.backpressureStrategy` | `"queue-latest"` | Coalesce latest values or use `"close"` |
| `websocket.maxQueuedMessages` | `64` | Maximum coalesced outbound values |
| `websocket.reconnect.enabled` | `true` | Client reconnection |
| `websocket.reconnect.attempts` | `10` | Maximum attempts per reconnect cycle |
| `websocket.reconnect.initialDelay` | `500` | Initial exponential-backoff delay |
| `websocket.reconnect.maxDelay` | `10000` | Maximum backoff delay |

Invalid supported configuration values produce diagnostics. Config and supported environment-file edits perform a controlled development restart. Start a fresh command after dependency/framework installation changes, and renew authorization when changing OAuth scopes.
