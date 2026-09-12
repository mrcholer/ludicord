# Login and sessions

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


Ludicord authentication follows the Embedded App SDK authorization-code flow:

```text
SDK ready → authorize → /_ludicord/auth/exchange
          → Discord token/user endpoints → SDK authenticate
          → /_ludicord/auth/complete → encrypted Ludicord session cookie
```

Use `useLudicordAuth()` or `useLudicordSession()` from `ludicord/auth`. Normal React APIs expose only safe identity and Activity context: user, guild, channel, instance, scopes, and expiry. Raw OAuth tokens, the Client Secret, and the Session Secret are not retained in public stores.

The exchange validates a one-time state cookie before using the authorization code. Production sessions use encrypted, authenticated, HttpOnly, Secure, SameSite=None, Partitioned cookies. Every Activity launch receives its own opaque launch ID, and auth cookies are scoped to that launch. Two Discord Activity instances open in the same browser cannot overwrite each other's OAuth state or session. Same-origin fetches and Ludicord WebSockets carry the launch identity automatically.

The exchange issues only a two-minute pending cookie: APIs and WebSockets reject it. After SDK authentication succeeds, a one-time confirmation creates the usable session, capped at one hour and the OAuth token expiry. Ludicord renews an expiring production session in place. A temporary renewal failure keeps the still-valid session and schedules a bounded retry. Explicit logout clears only the current launch.

OAuth state and pending confirmations use a bounded memory store by default. Multi-replica deployments should pass a shared `LudicordEphemeralTokenStore` to `createLudicordProductionServer()`; `consume()` must atomically remove its one-time token. Complete Discord `.raw` payloads separately use `LudicordSessionDataStore`.

Local fake sessions can model different users and instances with `LUDICORD_DEV_USER_ID`, `LUDICORD_DEV_USERNAME`, `LUDICORD_DEV_DISPLAY_NAME`, `LUDICORD_DEV_INSTANCE_ID`, `LUDICORD_DEV_GUILD_ID`, `LUDICORD_DEV_CHANNEL_ID`, and `LUDICORD_DEV_SCOPES`. They are explicitly marked and always rejected by production.

Authentication does not begin before the SDK is ready. A failed SDK `authenticate` command is not treated as a trusted login.
