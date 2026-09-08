# Release history

## 3.1.0 — September 8, 2026

Ludicord 3.1 strengthens production Discord Activities around authentication, Activity-instance isolation, realtime reliability, and multi-process deployment.

## Activity launch isolation

- Each browser launch now receives an opaque launch identifier that is attached automatically to same-origin HTTP requests and WebSocket connections.
- Session, OAuth-state, and pending-login cookies are isolated per launch.
- The same user can open two instances of the same Activity without one instance replacing the other instance's guild, channel, session, or WebSocket identity.
- Logging out or reauthenticating one launch does not log out another launch.
- External fetch requests are left unchanged.

## Authentication reliability

- Authenticated Activities renew their Discord-backed session before expiry without unmounting the running React tree.
- A failed renewal keeps the still-valid session and schedules another renewal attempt.
- Transient Discord Activity membership misses retry with bounded backoff.
- Discord rate-limit timing is returned to the client and respected during authentication retries.
- Cached Activity Instance data is refreshed once when a newly joined user is absent from the cached member list.
- Local fake authentication supports configurable users, instances, guilds, channels, and scopes.

## Multi-process deployments

- `LudicordEphemeralTokenStore` allows OAuth state and completion tokens to be shared across servers with atomic one-time consumption.
- `LudicordWebSocketAdapter` allows route and Activity-room events to cross process boundaries.
- Cluster-aware `totalClientCount()` helpers are available for routes, named rooms, and Activity instances.
- `LudicordSharedStateStore` provides atomic create and compare-and-set operations for shared Activity state.
- Memory-backed implementations remain available for single-process applications.
- `createLudicordProductionServer()` accepts shared session, ephemeral-token, and WebSocket adapters.

## WebSocket and shared-state behavior

- WebSocket connections wait for required authentication before opening.
- Reconnection resumes when the browser returns online or becomes visible after the normal retry burst is exhausted.
- `emitWithAck()` supports acknowledged events with bounded timeouts and server rejection details.
- Server route handlers receive route, room, and Activity broadcast helpers without keeping a client reference.
- `client.broadcast()` is Activity-instance-safe; explicit route-wide broadcasting uses `client.route.broadcast()`.
- Slow clients use latest-value coalescing by default instead of being disconnected immediately.
- Inbound message count and byte-rate limits are enforced independently.
- Shared-state validation, serialization, and size failures return an error event without disconnecting the client.
- Optimistic shared state rolls back to the latest authoritative value after rejection.
- Shared-state revisions can be coordinated atomically across multiple processes.

## Request and session security

- Framework HTTP routes validate allowed hosts and browser origins.
- WebSocket upgrades apply the same host and origin policy.
- Same-origin validation includes the port, and explicitly configured cross-origin callers remain supported.
- Production warns when every Host header is accepted.
- Activity Instance verification defaults to automatic activation when a Discord bot token is configured.
- Production WebSockets can require a server-verified Activity session.
- Production warns when Activity verification is inactive or a request proxy runs without Discord signature verification.
- Default WebSocket limits are reduced to 256 KiB per message and 512 KiB per second.

## Discord and React runtime

- Discord user, guild, channel, member, role, entitlement, permission, voice, orientation, and thermal payloads preserve the complete data returned by Discord.
- Scope diagnostics no longer update framework state during React render.
- `useActivityStorage()` supports explicit `application` and `instance` scopes while retaining the existing `activity` scope.
- `LUDICORD_VERSION` is typed as `string`, so patch releases do not break applications that consume the runtime version.

## Build, package, and generator

- The development server announces and reserves its Local URL before source compilation begins.
- Development startup also prints the LAN address when the server listens on all interfaces.
- Requests arriving during startup wait for the runtime handlers instead of receiving an early 404 response.
- Initial source compile failures keep the development server running and recover automatically after the file is fixed.
- Failed server builds remember the source dependency that caused the failure, allowing imported files to trigger recovery before a successful dependency graph exists.
- Compiler diagnostics take priority over duplicate module-load runtime errors in the development panel.
- Development diagnostics expose the current `listening`, `compiling`, `ready`, or `error` lifecycle state.
- Compiler cancellation messages caused by an intentional shutdown are ignored.
- Production builds use the new build schema and keep the previous valid output when a build fails.
- Package licenses are included in both public npm packages.
- `ludicord/internal` is no longer a public package export.
- Generated applications use automatic Activity Instance verification and same-origin request protection.
- Generated applications include safer WebSocket limits and configurable local Discord test identities.
- The generated app keeps the standard `dev`, `build`, and `start` scripts as its primary commands.

## Compatibility notes

- Cross-origin browser requests must be listed in `server.allowedOrigins`; the default is `"same-origin"`.
- Applications that intentionally send WebSocket messages larger than 256 KiB must set `websocket.maxPayload` explicitly.
- Multi-process applications should provide all required shared adapters. The memory stores remain process-local by design.
- Code importing `ludicord/internal` must stop; that path was never intended as an application API.

[GitHub release](https://github.com/mrcholer/ludicord/releases/tag/v3.1.0) · [ludicord on npm](https://www.npmjs.com/package/ludicord/v/3.1.0) · [creator on npm](https://www.npmjs.com/package/create-ludicord-app/v/3.1.0)

[Full release notes](releases/v3/3.1.0.md)


## 3.0.1 — September 6, 2026

This patch release improves clean-clone compatibility checks and keeps generated projects focused on the commands most applications need.

## Create Ludicord App

- Generated `package.json` files now include only `ludicord dev`, `ludicord build`, and `ludicord start` scripts.
- Lint, bundle analysis, route inspection, project information, and direct TypeScript checks remain available as advanced commands in the documentation.
- The focused starter app tree, authenticated API example, and realtime global, Home-viewer, and same-channel counters remain included.

## Compatibility checks

- Source checks now use `pnpm@10.30.3`, which supports every advertised Node.js version, including Node 20.19.
- Clean-clone typechecks build package declarations before checking workspace examples, so `ludicord` and its public subpath types resolve consistently on Linux, Windows, and macOS.
- The release workflow uses the same pinned package-manager version as source checks.

[GitHub release](https://github.com/mrcholer/ludicord/releases/tag/v3.0.1) · [ludicord on npm](https://www.npmjs.com/package/ludicord/v/3.0.1) · [creator on npm](https://www.npmjs.com/package/create-ludicord-app/v/3.0.1)

[Full release notes](releases/v3/3.0.1.md)


## 3.0.0 — September 6, 2026

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

[GitHub release](https://github.com/mrcholer/ludicord/releases/tag/v3.0.0) · [ludicord on npm](https://www.npmjs.com/package/ludicord/v/3.0.0) · [creator on npm](https://www.npmjs.com/package/create-ludicord-app/v/3.0.0)

[Full release notes](releases/v3/3.0.0.md)


## 2.2.5 — September 4, 2026

## Project creator

- Choose Tailwind CSS interactively when creating a project.
- Use `--tailwind` or `--no-tailwind` in scripts and automated setup.
- Start from a polished responsive interface with either Tailwind CSS or plain CSS.

## Package and documentation experience

- Added the Ludicord banner and live package badges to both npm package pages.
- Pointed package home, source, issues and release links to the public Ludicord repository.
- Added public package metadata snapshots, an LLM documentation index and agent instructions.
- Added a reusable Ludicord skill that teaches coding agents the framework's conventions, security boundaries and validation workflow.

## Release delivery

- Public npm trusted publishing now runs from the public repository with provenance.
- Private builds hand off only approved compiled tarballs, declarations and public notes; original TypeScript and private application code remain excluded.
- Version changes automatically stage the public payload, publish both packages, verify integrity, update the changelog and package records, and create matching public and maintainer releases.
- Discord announcements now use Components V2 with a role mention, branded container, changelog button and install command.

[GitHub release](https://github.com/mrcholer/ludicord/releases/tag/v2.2.5) · [ludicord on npm](https://www.npmjs.com/package/ludicord/v/2.2.5) · [creator on npm](https://www.npmjs.com/package/create-ludicord-app/v/2.2.5)

[Full release notes](releases/v2/2.2.5.md)


Verified against npm on September 4, 2026. Times are UTC. The packages have separate publication histories.

[GitHub release records](https://github.com/mrcholer/ludicord/releases) mirror this published-version list. GitHub records were created for this documentation repository; their creation dates are not the original npm publication dates, and their archives contain only documentation.

## 2.2.4 — September 4, 2026

Both packages are published at 2.2.4 through GitHub Actions trusted publishing.

Read the [changes and limitations](releases/v2/2.2.4.md) and [upgrade guide](docs/migration.md).

## ludicord

| Version | npm publication (UTC) | Status |
| --- | --- | --- |
| [2.2.5](https://www.npmjs.com/package/ludicord/v/2.2.5) | 2026-09-04 23:09:33 | Final v2 release |
| [2.2.4](https://www.npmjs.com/package/ludicord/v/2.2.4) | 2026-09-04 17:57:43 | Historical |
| [2.2.1](https://www.npmjs.com/package/ludicord/v/2.2.1) | 2026-09-04 12:03:18 | Historical |
| [2.2.0](https://www.npmjs.com/package/ludicord/v/2.2.0) | 2026-09-03 12:49:49 | Historical |
| [2.1.0](https://www.npmjs.com/package/ludicord/v/2.1.0) | 2026-09-02 11:39:29 | Historical |

## create-ludicord-app

| Version | npm publication (UTC) | Status |
| --- | --- | --- |
| [2.2.5](https://www.npmjs.com/package/create-ludicord-app/v/2.2.5) | 2026-09-04 23:09:38 | Final v2 release |
| [2.2.4](https://www.npmjs.com/package/create-ludicord-app/v/2.2.4) | 2026-09-04 17:57:47 | Historical |
| [2.2.3](https://www.npmjs.com/package/create-ludicord-app/v/2.2.3) | 2026-09-04 12:04:52 | Historical |
| [2.2.2](https://www.npmjs.com/package/create-ludicord-app/v/2.2.2) | 2026-09-03 13:50:52 | Historical |
| [2.2.1](https://www.npmjs.com/package/create-ludicord-app/v/2.2.1) | 2026-09-03 13:09:52 | Historical |
| [2.2.0](https://www.npmjs.com/package/create-ludicord-app/v/2.2.0) | 2026-09-03 12:54:07 | Historical |
| [2.1.0](https://www.npmjs.com/package/create-ludicord-app/v/2.1.0) | 2026-09-02 11:40:11 | Historical |

Detailed per-version notes for these historical publications were not recorded here; no feature changes are inferred from version numbers.

## Check current registry status

```bash
npm view ludicord version
npm view create-ludicord-app version
npm view ludicord versions --json
npm view create-ludicord-app versions --json
```

Documentation updates and GitHub release notices do not publish npm packages.
