# Environment Variables

> Documentation for Ludicord 3.1.0. See [release status](../releases/README.md).


```env
LUDICORD_DISCORD_CLIENT_ID=
LUDICORD_DISCORD_CLIENT_SECRET=
LUDICORD_SESSION_SECRET=
LUDICORD_DISCORD_PUBLIC_KEY=
# LUDICORD_DISCORD_BOT_TOKEN=
```

- `LUDICORD_DISCORD_CLIENT_ID` is the public Discord application/client ID and may reach the client bundle.
- `LUDICORD_DISCORD_CLIENT_SECRET` is the OAuth2 Client Secret. It is server-only.
- `LUDICORD_SESSION_SECRET` encrypts and authenticates session state. Use at least 32 random characters and keep it server-only.
- `LUDICORD_DISCORD_PUBLIC_KEY` enables optional Ed25519 proxy-request verification.
- `LUDICORD_DISCORD_BOT_TOKEN` is optional and is used for REST Activity Instance verification and permission-gated guild/channel/member lookups. It never starts a Gateway or bot runtime.

Use `.env.local` for local secrets and keep it out of source control. Commit only `.env.example` with empty values. `ludicord build` scans client output for actual server secret values and fails if one leaked.
