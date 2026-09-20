# Deployment

> Documentation for Ludicord 4.0.1. See [release status](../releases/README.md).


Deploy Ludicord to a Node.js 20.19+ environment that supports long-lived HTTP upgrades for WebSockets.

1. Install with a locked dependency file.
2. Set server-only environment variables and `LUDICORD_DISCORD_CLIENT_ID` in the hosting platform.
3. Run `ludicord build` during the build stage.
4. Persist the generated `.ludicord` directory into the runtime image.
5. Run `ludicord start` and route both HTTP and WebSocket traffic to the same port.
6. Serve the public origin over HTTPS and configure that hostname in Discord Activity URL Mapping.

Do not place a CDN cache in front of `/_ludicord/auth`, authenticated `/api/*`, or `/ws/*`. If a reverse proxy terminates TLS, preserve the host/protocol headers and WebSocket upgrade headers. Sessions use secure partitioned cookies in production, so test the final iframe origin rather than only a direct server URL.

The Client ID can be present during the build or supplied to `ludicord start`. A runtime value takes precedence and is injected into the Activity document, allowing one promoted build to run against the intended Discord application. The same effective ID protects HTTP, authentication, and WebSocket requests. With the default origin policy, the exact Activity proxy origin is `https://<clientId>.discordsays.com`; do not add a wildcard for all Discord applications.

The built-in session, OAuth-token, WebSocket, and shared-state implementations are process-local. Multiple replicas should use a custom launcher:

```ts
import { createLudicordProductionServer } from "ludicord/runtime/server";

const server = await createLudicordProductionServer({
  projectRoot: process.cwd(),
  sessionDataStore,
  ephemeralTokenStore,
  websocketAdapter,
});
```

Use `LudicordSessionDataStore` for complete Discord `.raw` data, `LudicordEphemeralTokenStore` for atomic OAuth state/completion consumption, and `LudicordWebSocketAdapter` for cross-process delivery and total counts. Pass a `LudicordSharedStateStore` directly to `defineSharedActivityState()` for atomic state revisions. Route shutdown signals through `server.close()` so requests, sockets, and instrumentation drain cleanly.
