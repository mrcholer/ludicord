# Login and sessions

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).


Ludicord authentication follows the Embedded App SDK authorization-code flow:

```text
SDK ready → authorize → /_ludicord/auth/exchange
          → Discord token/user endpoints → SDK authenticate
          → /_ludicord/auth/complete → encrypted Ludicord session cookie
```

Use `useLudicordAuth()` or `useLudicordSession()` from `ludicord/auth`. Normal React APIs expose only safe identity and Activity context: user, guild, channel, instance, scopes, and expiry. Raw OAuth tokens, the Client Secret, and the Session Secret are not retained in public stores.

The exchange validates a one-time state cookie before using the authorization code. Production sessions use an encrypted, authenticated, HttpOnly, Secure, SameSite=None, Partitioned cookie. The exchange issues only a two-minute pending cookie: APIs and WebSockets reject it. After SDK authentication succeeds, a one-time confirmation creates the usable session (capped at one hour and the OAuth token expiry). Logout clears all auth cookies. Failed login attempts can be retried.

OAuth state and pending confirmations are bounded, process-local stores. Multi-replica deployments need sticky routing for the login handshake. Development fake sessions are explicitly marked and always rejected by production, even when the same encryption secret is used.

Authentication does not begin before the SDK is ready. A failed SDK `authenticate` command is not treated as a trusted login.
