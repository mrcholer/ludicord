# Deployment

> Documentation for Ludicord 4.1.2. See [release status](../releases/README.md).


Deploy Ludicord to a Node.js 20.19+ environment that supports long-lived HTTP upgrades for WebSockets.

1. Install with a locked dependency file.
2. Set server-only environment variables and `LUDICORD_DISCORD_CLIENT_ID` in the hosting platform.
3. Run `ludicord build` during the build stage.
4. Persist the generated `.ludicord` directory into the runtime image.
5. Run `ludicord start` and route both HTTP and WebSocket traffic to the same port.
6. Serve the public origin over HTTPS and configure that hostname in Discord Activity URL Mapping.

Do not place a CDN cache in front of `/_ludicord/auth`, authenticated `/api/*`, or `/ws/*`. If a reverse proxy terminates TLS, preserve the host/protocol headers and WebSocket upgrade headers. Sessions use secure partitioned cookies in production, so test the final iframe origin rather than only a direct server URL.

The Client ID can be present during the build or supplied to `ludicord start`. A runtime value takes precedence and is injected into the Activity document, allowing one promoted build to run against the intended Discord application. The same effective ID protects HTTP, authentication, and WebSocket requests. With the default origin policy, the exact Activity proxy origin is `https://<clientId>.discordsays.com`; do not add a wildcard for all Discord applications.

## Production HTTP caching

The production server applies these policies automatically:

| Response | `Cache-Control` | Behavior |
| --- | --- | --- |
| Compiler-generated hashed JavaScript, CSS, and other assets | `public, max-age=31536000, immutable` | Browsers and CDNs can reuse the file for one year. Changed content receives a new URL on the next build. |
| Activity HTML, including `/index.html` and nested pages | `no-cache` | Validate before reuse so the document points to the current build and runtime Client ID. |
| Files copied from `public/` and other unversioned static files | `no-cache` | Validate before reuse, even when a filename happens to look hashed. |
| Auth, API, health, missing assets, and other dynamic responses | `no-store` by default | Do not store responses unless an application handler deliberately supplies its own caching header. |

HTML and static files include ETags for conditional requests. Unchanged resources return `304 Not Modified` without retransmitting their body; static files also provide `Last-Modified` validators. GET, HEAD, and successful range responses use the same resource cache policy. Missing hashed chunks return an uncached 404 even when the app defines a catch-all page.

The build records the immutable asset list from compiler output in `build.json`; it does not infer immutability from arbitrary public filenames. Older schema-4 builds without that list remain supported and revalidate all static files. Rebuild with the updated compiler to enable long-lived asset caching.

Configure your CDN or reverse proxy to honor these headers. When deploying, retain older hashed assets for existing Activity sessions that may still request lazy chunks from the previous build. The local build replacement does not retain those assets automatically. Do not apply a one-year cache policy to HTML or the entire `public/` directory.

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
