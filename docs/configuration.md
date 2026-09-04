# Configuration reference

> Preview documentation for upcoming 2.2.4, not yet published. See [release status](../releases/README.md).

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
| `discord.auth.activityInstanceVerification` | `false` | Enable optional REST instance verification |
| `activity.defaultEmbed` | `"home"` | Initial registered embed |
| `activity.outsideDiscord` | `"error"` | `error`, `allow` or `mock` outside Discord |

Allow mode does not fabricate Discord identity. Mock mode is for development/testing, never a substitute for production authentication. Verification requires the relevant server credentials; see [security](security.md).

## HTTP server

| Setting | Default | Meaning |
| --- | --- | --- |
| `server.port` | `3000` | Listening port |
| `server.host` | `"0.0.0.0"` | Listening interface |
| `server.allowedHosts` | `true` | All hosts, or an explicit hostname list |
| `server.limits.body` | `"2mb"` | HTTP request body limit |

Use an explicit host list when appropriate. CLI host/port flags override environment values; `HOST` and `PORT` override configured defaults.

## WebSockets

All durations below are milliseconds.

| Setting | Default | Meaning |
| --- | --- | --- |
| `websocket.enabled` | `true` | Enable WebSockets |
| `websocket.heartbeatInterval` | `30000` | Heartbeat interval |
| `websocket.maxPayload` | `1048576` | Maximum message size, bytes |
| `websocket.compression` | `false` | Enable compression |
| `websocket.reconnect.enabled` | `true` | Client reconnection |
| `websocket.reconnect.attempts` | `10` | Maximum attempts per reconnect cycle |
| `websocket.reconnect.initialDelay` | `500` | Initial exponential-backoff delay |
| `websocket.reconnect.maxDelay` | `10000` | Maximum backoff delay |

Invalid supported configuration values produce diagnostics. Restart development after configuration changes. Renew authorization when changing OAuth scopes.
