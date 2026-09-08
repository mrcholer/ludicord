# Login, Sessions, and Security

Read [login and sessions](https://github.com/mrcholer/ludicord/blob/main/docs/login.md),
[security](https://github.com/mrcholer/ludicord/blob/main/docs/security.md), and
[environment variables](https://github.com/mrcholer/ludicord/blob/main/docs/environment-variables.md) for the full
guides.

## Login flow

Ludicord follows the Embedded App SDK authorization-code flow:

```text
SDK ready → authorize → /_ludicord/auth/exchange
          → Discord token/user endpoints → SDK authenticate
          → /_ludicord/auth/complete → encrypted Ludicord session cookie
```

- The Activity owns initialization. Use `useLudicordAuth()` or
  `useLudicordSession()` from `ludicord/auth` for safe identity and Activity
  context (user, guild, channel, instance, scopes, expiry) — never duplicate
  SDK login in page components.
- `authenticateLudicord` and `logoutLudicord` cover explicit login/logout
  actions; `useAuthStatus` and `useAuthError` cover state. Failed logins are
  retryable; logout clears all auth cookies.
- Raw OAuth tokens, the Client Secret, and the Session Secret never reach
  public stores.

Session mechanics that constrain deployments:

- Production sessions use an encrypted, authenticated, HttpOnly, Secure,
  SameSite=None, Partitioned cookie, capped at one hour and the OAuth token
  expiry.
- The exchange issues only a two-minute pending cookie: APIs and WebSockets
  reject it. A one-time confirmation creates the usable session.
- OAuth state and pending confirmations are bounded, process-local stores —
  multi-replica deployments need sticky routing for the login handshake.
- Development fake sessions are explicitly marked and always rejected by
  production, even with the same encryption secret.
- Authentication never begins before the SDK is ready; a failed SDK
  `authenticate` command is not a trusted login.

For local browser-only prototypes, set `activity.outsideDiscord` to `allow`
and `discord.auth.required` to `false`. SDK-dependent features stay
unavailable outside Discord.

## Environment variables

```env
LUDICORD_DISCORD_CLIENT_ID=
LUDICORD_DISCORD_CLIENT_SECRET=
LUDICORD_SESSION_SECRET=
LUDICORD_DISCORD_PUBLIC_KEY=
# LUDICORD_DISCORD_BOT_TOKEN=
```

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `LUDICORD_DISCORD_CLIENT_ID` | May reach the client bundle | Public Discord application ID |
| `LUDICORD_DISCORD_CLIENT_SECRET` | Server-only | OAuth2 Client Secret |
| `LUDICORD_SESSION_SECRET` | Server-only | Session encryption; ≥ 32 random characters |
| `LUDICORD_DISCORD_PUBLIC_KEY` | Server-only | Optional Ed25519 proxy-request verification |
| `LUDICORD_DISCORD_BOT_TOKEN` | Server-only, optional | REST instance verification + permission-gated guild/channel/member lookups; never starts a Gateway or bot runtime |

- Keep secrets in `.env.local` (out of source control). Commit only
  `.env.example` with empty values.
- `ludicord build` scans production client output for actual server secret
  values and fails when one leaked. Rotate a secret immediately when the
  build scanner or another trusted diagnostic reports exposure.

## Security model

- Sessions are encrypted and authenticated with AES-256-GCM; OAuth state is
  validated with a one-time state cookie; server secrets stay out of React
  stores; API and WebSocket routes require sessions by default.
- Never trust user, guild, channel, application, or instance IDs from
  request bodies — use the encrypted `request.ludicord` context.
- Validate request bodies and authorization on the server. Production
  responses never leak stack traces or filesystem paths.

Optional verifications (both fail closed):

- **Discord proxy verification** (`discord.auth.proxyVerification` with
  `LUDICORD_DISCORD_PUBLIC_KEY`): missing, malformed, stale, or invalid
  Ed25519 signatures fail. `request.verification.discordProxy` becomes
  `verified` only after successful cryptographic verification.
- **Activity Instance verification**
  (`discord.auth.activityInstanceVerification` with
  `LUDICORD_DISCORD_BOT_TOKEN`): checked against Discord's REST Activity
  Instance endpoint, cached briefly and bounded without bypassing rate
  limits. Sessions receive `activityInstanceVerified: true` only after
  success.
