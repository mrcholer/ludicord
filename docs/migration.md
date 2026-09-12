# Upgrading to Ludicord 3.1.0

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).

Both packages are published at 3.1.0. Check your current versions:

```bash
npm view ludicord version
npm view create-ludicord-app version
```

Update an existing application's framework dependency with `npm install ludicord@3.1.0` (or your package-manager equivalent), update its lockfile, and create a fresh production build. The generator is for new projects; do not run it over an existing non-empty application.

## Review your application

1. Replace manual loading/error/auth/minimize wiring with the automatic files where appropriate. Keep one `LudicordActivity` and `EmbedOutlet` in `app/pages.tsx`.
2. Keep embed filenames as `embed.tsx`. Lowercase `export default function embed()` is supported; existing uppercase component names remain compatible.
3. Import browser readiness from `ludicord/runtime`; server tooling belongs in `ludicord/runtime/server`.
4. Use `ludicord/ws/client` in React and `ludicord/ws/server` in server handlers.
5. Remove assumptions that API/WS module memory survives edits. Use persistent external storage as required.
6. Let Ludicord complete authentication before calling protected APIs or opening sockets. Do not call internal auth endpoints manually.
7. Re-authorize after adding scopes such as `guilds` or approved voice/DM scopes.
8. Test with minimal Discord permissions and without optional bot credentials; handle unavailable data explicitly.
9. Replace direct browser routing with `useEmbedRouter()` and generated route types. Ludicord 3 synchronizes valid embed hashes with browser history while keeping the Activity pathname stable.
10. Remove `ludicord doctor` from scripts and automation. Generated projects expose only `dev`, `build`, and `start`; use `routes`, `lint`, `analyze`, `info`, and `clean` as documented advanced CLI commands.
11. Never import `ludicord/internal`. Use a documented public entry point and verify exact signatures against the installed declarations.
12. Cross-origin callers must be explicit in `server.allowedOrigins`; the new default is `"same-origin"`, including the port. Configure production/tunnel hostnames with `server.allowedHosts` when possible.
13. Review WebSocket traffic against the 256 KiB message and 512 KiB-per-second defaults. Prefer Activity-scoped broadcasts and use `client.route.broadcast()` only for deliberate route-wide delivery.
14. Multi-process deployments should provide shared session, one-time OAuth token, WebSocket, and shared-state adapters. The built-in memory implementations remain single-process.

## Verify before deployment

- Typecheck and production build succeed.
- Correcting an embed/API/WS error recovers the dev experience.
- Production errors do not expose source excerpts or secrets.
- Real Discord sign-in, session expiry, reconnects and mobile/PiP work in your application.
- Multiple users and separate Activity instances remain isolated.
- Reverse proxy and HTTPS support secure iframe cookies and WebSocket upgrades.

Back up your current lockfile and keep the last deployable build for rollback. Review the [3.0.0 framework changes](../releases/v3/3.0.0.md), [3.0.1 patch notes](../releases/v3/3.0.1.md), [3.1.0 release notes](../releases/v3/3.1.0.md), [security](security.md), and [deployment](deployment.md).
