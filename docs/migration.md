# Upgrading to Ludicord 4.0.0

> Documentation for Ludicord 4.0.0. See [release status](../releases/README.md).

Check that both 4.0.0 packages are available before upgrading:

```bash
npm view ludicord version
npm view create-ludicord-app version
```

Update an existing application's framework dependency with `npm install ludicord@4.0.0` (or your package-manager equivalent), update its lockfile, and create a fresh production build. The generator is for new projects; do not run it over an existing non-empty application. Existing V3 trees remain supported through legacy compatibility mode; follow [the routing migration](migration-v4.md) before switching file conventions.

## Review your application

1. Replace manual loading/error/auth/minimize wiring with the automatic files where appropriate. For embed-based pages, use one Activity boundary and one outlet. Plain pages need no outlet.
2. Keep embed filenames as `embed.tsx`. Lowercase `export default function embed()` is supported; existing uppercase component names remain compatible.
3. Import browser readiness from `ludicord/runtime`; server tooling belongs in `ludicord/runtime/server`.
4. Use `ludicord/ws/client` in React and `ludicord/ws/server` in server handlers.
5. Remove assumptions that API/WS module memory survives edits. Use persistent external storage as required.
6. Let Ludicord complete authentication before calling protected APIs or opening sockets. Do not call internal auth endpoints manually.
7. Re-authorize after adding scopes such as `guilds` or approved voice/DM scopes.
8. Test with minimal Discord permissions and without optional bot credentials; handle unavailable data explicitly.
9. Replace direct browser routing with `useEmbedRouter()` and generated route types. Ludicord 4 synchronizes valid embed hashes with browser history while keeping the Activity pathname stable.
10. Remove `ludicord doctor` from scripts and automation. Generated projects expose only `dev`, `build`, and `start`; use `routes`, `lint`, `analyze`, `info`, and `clean` as documented advanced CLI commands.
11. Never import `ludicord/internal`. Use a documented public entry point and verify exact signatures against the installed declarations.
12. Cross-origin callers must be explicit in `server.allowedOrigins`; the default is `"discord-activity"`, allowing same-origin traffic and this application's exact Discord proxy origin. Configure production/tunnel hostnames with `server.allowedHosts` when possible.
13. Review WebSocket traffic against the 256 KiB message and 512 KiB-per-second defaults. Prefer Activity-scoped broadcasts and use `client.route.broadcast()` only for deliberate route-wide delivery.
14. Multi-process deployments should provide shared session, one-time OAuth token, WebSocket, and shared-state adapters. The built-in memory implementations remain single-process.
15. Add `imports.aliases` to `ludicord.config.mjs` and matching `baseUrl`/`paths` entries to `tsconfig.json` before converting deep relative imports to project aliases.
16. Add independent page paths only for a large project or a concrete URL/shell requirement. Unified pages live directly at `app/<path>/page.tsx`; no `prefix/` scaffolding is required.
17. Replace cross-prefix browser URL construction with typed `PrefixLink` or `prefixHref()`. Continue using `Link` and `useEmbedRouter()` for embeds inside the current prefix.

## Verify before deployment

- Typecheck and production build succeed.
- Correcting an embed/API/WS error recovers the dev experience.
- Production errors do not expose source excerpts or secrets.
- Real Discord sign-in, session expiry, reconnects and mobile/PiP work in your application.
- Multiple users and separate Activity instances remain isolated.
- Reverse proxy and HTTPS support secure iframe cookies and WebSocket upgrades.
- Every expected prefix pathname and default embed URL returns the correct shell.
- Unknown production prefixes return 404 instead of falling through to an unrelated scope.

Back up your current lockfile and keep the last deployable build for rollback. Review the detailed [V4 migration guide](migration-v4.md), [page scopes and unified routing](prefix-router.md), [4.0.0 release notes](../releases/v4/4.0.0.md), [security](security.md), and [deployment](deployment.md).
