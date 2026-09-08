# Ludicord 3.1.0

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
