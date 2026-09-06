# Ludicord 3.0.0

Ludicord 3.0 is the first major framework release. It focuses on complete Discord data, a dependable Next-style development experience, safer long-running servers, and build output that remains usable when a new compile fails.

## Complete Discord data

- User, channel, guild, guild-member, participant, and voice-state values keep Ludicord's normalized convenience properties and now include `raw`, containing the complete object supplied by Discord.
- OAuth `/users/@me` fields such as banners, flags, decorations, locale, premium metadata, and future Discord additions are retained in `session.user.raw` and `useDiscordUser().raw`. OAuth credentials are never included.
- The selected `/users/@me/guilds` object is retained as `session.guildRaw` and used by `useDiscordGuild()` until richer verified REST data is available.
- `useDiscordData()` returns the complete shared Discord state snapshot.
- `useDiscordRawEvent(name)` returns the latest untouched SDK payload for supported events, including voice, speaking, layout, orientation, current-user, current-member, thermal, participant, and entitlement updates.
- `useCurrentGuildMember()` is enriched automatically from the verified server context when the SDK event is unavailable.
- `useDiscordGuildMembers()` retains the complete member object and complete nested user object on every result.
- Added verified `useDiscordGuildChannels()`, `useDiscordGuildRoles()`, and `useDiscordGuildMember(userId?)` resources with `data`, `status`, `error`, `updatedAt`, and `refresh()`.
- Added `refreshDiscordData()` to refresh core Discord context and every mounted server resource, and `useDiscordPermissions()` for explicit guild/channel/member bitfields and safe bigint-compatible checks.
- Discord avatar, banner, guild icon, member avatar, and avatar-decoration CDN helpers now normalize static and animated hashes consistently while every original hash remains in `.raw`.
- `createDiscordRest()` remains server-only and now provides `getUser`, `getGuild`, `getChannel`, `getGuildMember`, `listGuildMembers`, `listGuildChannels`, `listGuildRoles`, and a validated read-only API-v10 `get<T>()` escape hatch. Responses are not reduced to a small framework-owned shape.
- Server REST reads now use bounded caching, concurrent-request deduplication, abortable timeouts, Discord bucket/global limit tracking, and one bounded short-429 retry. Unsafe absolute, traversal, backslash, or newline-containing resource paths are rejected, and the bot token never enters generated client code.

## Compact, extensible sessions

- Complete Discord `.raw` user and guild payloads are stored behind an opaque random server-side data key instead of being placed in the encrypted browser cookie.
- Pending and final cookies remain compact even when Discord adds large profile fields, avoiding common four-kilobyte browser/proxy cookie failures.
- Session responses rehydrate the complete payload, while the internal data key is never returned to client code.
- The built-in store is bounded, expiring, and in-memory. `createMemorySessionDataStore()` and the `LudicordSessionDataStore` interface support controlled custom/shared storage for multi-process deployments.

## Diagnostics V2

- Replaced the old development overlay with the new Ludicord black/red panel design.
- Syntax, TypeScript, React render, event-handler, rejected-promise, API, and WebSocket failures share one diagnostic format.
- Errors show exact relative file, line, column, highlighted source frame, server stack, and React component stack when available.
- Clicking the source location uses the local editor endpoint and also copies the location.
- Copy includes the complete diagnostic rather than only the path.
- Retry re-reads active diagnostics and no longer hides an unresolved error.
- The panel can be minimized and reopened from its error badge; multiple errors support paging and keyboard navigation.
- Source highlighting uses a safe single-pass tokenizer. Source text is escaped before markup is added, preventing source snippets from becoming panel HTML.
- Removed external font requests so the panel works offline and under stricter Content Security Policies.
- Development diagnostic endpoints use a per-run client token for non-loopback access and are absent from production.
- Redaction now covers arbitrary environment variables whose names indicate secrets, tokens, passwords, signing-key material, database URLs, or API/access keys. Messages, frames, stacks, and component stacks are all redacted.
- Full-document development failures render a matching Ludicord HTML error screen instead of the previous JSON dead end.

## Routing and automatic not-found UI

- Added the automatic `app/not-found.tsx` convention. It is discovered, imported, and connected by Ludicord without edits to `app/pages.tsx`.
- Unknown URL hashes preserve the requested deep link and render the project not-found component.
- Projects without `app/not-found.tsx` receive a built-in dark reload/back screen.
- Typed `router.push()` and `router.replace()` still reject unknown routes with `LUDICORD2001`, catching application mistakes early.
- Embed navigation now synchronizes with real browser history, including browser back/forward and manual hash changes, while keeping the Activity pathname stable.
- Generated projects use the built-in not-found fallback until an app chooses to add `app/not-found.tsx`.
- Embed folders now support inherited `layout.tsx` files plus nearest-route `loading.tsx` and `error.tsx` files. The compiler discovers and connects them without changes to `pages.tsx`.
- Added `app/global-error.tsx` for root failures; it takes precedence over the normal Activity error component at the outer boundary.
- Added automatic `app/metadata.ts` with `defineMetadata()` for title, description, application name, theme color, and color-scheme metadata.
- Added server-only `app/instrumentation.ts` with a typed `register()` lifecycle and optional async cleanup. Development graph replacement cleans up and re-registers it; production runs cleanup after server drain.
- Added route groups such as `app/embeds/(games)/chess/embed.tsx`; parenthesized folders organize embeds, APIs, WebSockets, layouts, and fallbacks without changing URLs.
- Added typed `Link` navigation and `router.prefetch()`. Lazy embed modules are cached and can warm on viewport proximity, focus, or hover without double-loading during navigation.
- Added automatic server-only `app/proxy.ts` for redirects, maintenance responses, and pre-routing decisions. Framework-owned `/_ludicord/*` routes always bypass it.

## React and Activity state

- React Strict Mode is enabled by default in development and can be controlled with `react.strictMode`.
- Added `ludicord lint` with the Rules of Hooks and exhaustive dependency checks. It understands Ludicord's lowercase `embed()` convention while retaining exact source locations.
- Added `useActivityLifecycle()` for visibility, focus, online state, Discord readiness, and aggregate WebSocket readiness.
- Added `useActivityStorage()` with activity, user, guild, and channel scopes plus cross-tab updates and custom serialization.
- Added `useActivityQuery()` with bounded caching, request deduplication, stale times, retries, abortable timeouts, manual refetch, mutation, and stale-request race protection.
- Added `useDiscordEvent()` for cleanup-safe callbacks using untouched Discord SDK event payloads, with optional latest-event replay.
- Added `useActivityPresence()` for participants, current participant, voice states, speaking users, and alone-state summaries.
- Added `useGameLoop()` with managed animation frames, hidden-tab pausing, and clamped frame deltas.
- Added `useSharedActivityState()` and `defineSharedActivityState()` for small revision-checked values isolated by verified application and Activity instance. Rapid updates are queued behind one in-flight revision and reconnects reconcile with the server before resending. Built-in rooms, lifetime, JSON value size, and validation are bounded; durable or multi-process state remains application-owned.

## Development runtime reliability

- Saving `ludicord.config.mjs`, `.env`, `.env.local`, `.env.development`, or `.env.development.local` performs a controlled Ludicord restart automatically; developers no longer need to stop and rerun the command for these files.
- Config and environment changes use exact per-file polling instead of relying on unreliable recursive watcher filenames, including on Windows and OneDrive workspaces.
- Invalid configuration is reported clearly and can be retried by saving again.
- API/WebSocket source and imported local modules continue to rebuild without restarting the HTTP process.
- A failed server graph compile keeps the last working graph active.
- Successful graph replacement removes obsolete bundle directories, and dev shutdown removes the current run directory.
- The runtime remains Ludicord-branded; Vite stays an internal compiler implementation.
- Fixed browser-runtime dependencies are optimized up front, removing the background dependency-discovery shutdown race that could print false `build was canceled` or missing-cache-directory errors after the dev server stopped.

## Production build durability

- Production builds are created in an isolated temporary directory and installed atomically only after type checking, client compilation, server bundling, manifest writing, and client secret scanning succeed.
- A failed build preserves the previous `.ludicord` output instead of deleting the last deployable build.
- Failed temporary output and replacement backups are cleaned safely.
- Transient Windows, antivirus, and synced-folder locks receive bounded retries during atomic replacement. If replacement still fails, Ludicord restores the previous build instead of leaving the output half-installed.
- Strictly named temporary build and backup directories older than 24 hours are cleaned before a later build; fresh or unrelated directories are never matched.
- `build.json` now has an explicit build schema version. `ludicord start` checks schema compatibility instead of rejecting a valid build merely because the framework package version changed.
- An incompatible or missing schema reports `LUDICORD3002` with a direct instruction to run `ludicord build` again.
- Every successful build writes `.ludicord/bundle-report.json` with raw and gzip client-asset sizes. `ludicord analyze` and `ludicord analyze --json` inspect the result without rebuilding.
- `build.clientAssetWarningLimit` controls non-failing per-asset warnings and defaults to 512,000 bytes.

## API and WebSocket hardening

- API routes have a configurable `server.requestTimeout` (default `30000` ms, validated from 1 ms through 15 minutes).
- Timed-out API routes receive an aborted `request.signal` and return `504` with `LUDICORD_ROUTE_TIMEOUT`.
- Client disconnects also abort the Web `Request` signal so downstream operations can stop work.
- WebSocket clients have a configurable inbound `websocket.maxMessagesPerSecond` limit (default `120`, validated from 1 through 10000).
- Clients exceeding that limit close with WebSocket policy code `1008`.
- Existing payload-size, malformed-envelope, reserved-event, session-expiry, heartbeat, room-isolation, and outbound-backpressure protections remain in place.
- Production shutdown now stops accepting new connections, rejects late keep-alive work with structured `503 LUDICORD_SHUTTING_DOWN`, drains active responses, closes WebSockets with code `1001`, and force-closes leftovers after configurable `server.shutdownTimeout` (default `10000` ms).
- Shutdown is idempotent, so duplicate signal/host cleanup calls share one operation and instrumentation cleanup runs once.
- Instrumentation may define async `onRequestError(error, context)` for API, WebSocket, proxy, and server failures. Reporting failures are contained and diagnostics remain redacted.

## Create Ludicord App 3.0

- Generated projects target `ludicord@^3.0.0`.
- The interactive Tailwind choice and `--tailwind` / `--no-tailwind` flags remain available; Tailwind is the default for non-interactive generation.
- Starter configuration includes the API timeout and WebSocket inbound-rate defaults.
- Starter configuration also includes the graceful-shutdown deadline.
- Starter configuration enables React Strict Mode and the default client-asset warning threshold.
- Starter package scripts include `ludicord lint` and `ludicord analyze`.
- Starter projects keep a focused `app/` tree with `pages.tsx`, `globals.css`, `minimize.tsx`, auth states, Home and Me embeds, an authenticated API example, and a persistent audience WebSocket that counts unique global users, Home viewers, and users in the current Discord channel.

## Compatibility and migration

- Existing normalized Discord properties (`id`, `displayName`, `kind`, `memberCount`, and others) remain available. Use `.raw` when the exact Discord response is needed.
- The raw payload type is `Readonly<Record<string, unknown>>` because available fields depend on Discord scopes, permissions, client support, and future API additions. Narrow or validate fields before use.
- Run a new production build after upgrading because Ludicord 3 introduces build-schema metadata.
- Review the two new limits if an Activity intentionally runs API handlers longer than 30 seconds or receives more than 120 WebSocket events per client per second.
- OAuth scope changes still require users to authorize the new scopes again.
- `ludicord doctor` is not part of this release and remains removed from the roadmap.
