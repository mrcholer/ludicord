# Upgrading to 2.2.4

> Documentation for Ludicord 2.2.5. See [release status](../releases/README.md).

Both packages are published at 2.2.4. Check your current versions:

```bash
npm view ludicord version
npm view create-ludicord-app version
```

Update an existing application's framework dependency with `npm install ludicord@2.2.4` (or your package-manager equivalent), update its lockfile, then run its typecheck/build checks. The generator is for new projects; do not run it over an existing non-empty application.

## Review your application

1. Replace manual loading/error/auth/minimize wiring with the automatic files where appropriate. Keep one `LudicordActivity` and `EmbedOutlet` in `app/pages.tsx`.
2. Keep embed filenames as `embed.tsx`. Lowercase `export default function embed()` is supported; existing uppercase component names remain compatible.
3. Import browser readiness from `ludicord/runtime`; server tooling belongs in `ludicord/runtime/server`.
4. Use `ludicord/ws/client` in React and `ludicord/ws/server` in server handlers.
5. Remove assumptions that API/WS module memory survives edits. Use persistent external storage as required.
6. Let Ludicord complete authentication before calling protected APIs or opening sockets. Do not call internal auth endpoints manually.
7. Re-authorize after adding scopes such as `guilds` or approved voice/DM scopes.
8. Test with minimal Discord permissions and without optional bot credentials; handle unavailable data explicitly.

## Verify before deployment

- Typecheck and production build succeed.
- Correcting an embed/API/WS error recovers the dev experience.
- Production errors do not expose source excerpts or secrets.
- Real Discord sign-in, session expiry, reconnects and mobile/PiP work in your application.
- Multiple users and separate Activity instances remain isolated.
- Reverse proxy and HTTPS support secure iframe cookies and WebSocket upgrades.

Back up your current lockfile and keep the last deployable build for rollback. Review [release notes](../releases/2.2.4.md), [security](security.md) and [deployment](deployment.md).
