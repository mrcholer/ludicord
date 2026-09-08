# Security

> Documentation for Ludicord 3.1.0. See [release status](../releases/README.md).


Ludicord encrypts and authenticates session cookies with AES-256-GCM, validates OAuth state, keeps server secrets out of React stores, requires sessions for API and WebSocket routes by default, and scans production client output for actual secret values.

HTTP requests and WebSocket upgrades share the same boundary checks. `server.allowedOrigins` defaults to `"same-origin"`, including the port, and rejects mismatched browser origins before application handlers run. `server.allowedHosts` can restrict the `Host` header to production and tunnel hostnames; `true` accepts every host and produces a production warning.

Large Discord payloads are not copied into the browser cookie. Compact trusted claims plus an opaque data key remain in the encrypted cookie, while complete `.raw` objects use a bounded server-side `LudicordSessionDataStore`. Losing that enrichment never converts untrusted browser data into an authenticated claim.

Optional Discord proxy verification uses Ed25519 with `LUDICORD_DISCORD_PUBLIC_KEY`. When `discord.auth.proxyVerification` is enabled, missing, malformed, stale, or invalid signatures fail closed. `request.verification.discordProxy` becomes `verified` only after successful cryptographic verification.

Activity Instance verification defaults to `"auto"`: a configured `LUDICORD_DISCORD_BOT_TOKEN` activates verification against Discord's REST endpoint. Set `discord.auth.activityInstanceVerification` to `true` to require it and fail authentication closed when the token or Activity context is missing, or `false` to opt out. Successful checks are cached briefly and bounded. The same server-only token can enable permission-gated guild/channel/member REST lookups. It never starts a Gateway connection or bot runtime.

Never trust user, guild, channel, application, or instance IDs from request bodies. Use the encrypted `request.ludicord` context. Rotate a secret immediately if the production build scanner or another trusted diagnostic reports exposure.

WebSocket clients are bounded independently by payload size, inbound message count, inbound byte rate, and outbound backpressure. Application handlers must still validate payload shape, authorize business actions, and rate-limit expensive operations.
