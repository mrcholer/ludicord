# Security

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


Ludicord encrypts and authenticates session cookies with AES-256-GCM, validates OAuth state, keeps server secrets out of React stores, requires sessions for API and WebSocket routes by default, and scans production client output for actual secret values.

Optional Discord proxy verification uses Ed25519 with `LUDICORD_DISCORD_PUBLIC_KEY`. When `discord.auth.proxyVerification` is enabled, missing, malformed, stale, or invalid signatures fail closed. `request.verification.discordProxy` becomes `verified` only after successful cryptographic verification.

Optional Activity Instance verification uses `LUDICORD_DISCORD_BOT_TOKEN` against Discord's REST Activity Instance endpoint. Successful checks are cached briefly and bounded; rate limits are not bypassed. The same server-only token can enable permission-gated guild/channel/member REST lookups. It never starts a Gateway connection or bot runtime. Sessions receive `activityInstanceVerified: true` only after success.

Never trust user, guild, channel, application, or instance IDs from request bodies. Use the encrypted `request.ludicord` context. Rotate a secret immediately if `ludicord doctor` or the build secret scanner reports exposure.
