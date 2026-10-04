# Ludicord 4.2.0

Ludicord 4.2.0 strengthens realtime recovery and exposes connection and performance data for applications to display in their own UI.

## Release summary

- Recover from stalled handshakes, transport errors, and stale open sockets with configurable timeouts and bounded retries.
- Add reconnect jitter and negotiated health probes, including fresh checks when an Activity becomes visible or returns online.
- Expose immutable connection snapshots through `useWSDiagnostics()`: status, latency, retry counts, next retry delay, safe error codes, and close details.
- Add `useActivityPerformance()` for optional FPS and frame-time samples plus framework startup timings, with developer-controlled sampling.
- Provide non-React getters and subscriptions for diagnostics and startup timings; these APIs render no UI and send no telemetry.

## Recovery controls

The handshake timeout defaults to 10 seconds. Health checks default to a 15-second interval and a 10-second response deadline. Reconnect jitter defaults to 20%; set `reconnect.jitter: 0` for deterministic delays. Settings are configurable globally or per connection. `reconnect.enabled: false` disables automatic retries and browser-resume recovery. Manual close cancels pending timers.

Health support is negotiated after authentication. Older clients receive no extra capability messages, and newer clients on older servers send no probes. Probes use the existing session and rate-limit protections. Missed application actions are never replayed automatically; applications own resynchronization and idempotency.

## Data APIs

Import `useWSDiagnostics` from `ludicord/ws/client`. Diagnostics subscriptions are separate from ordinary `useWS` consumers, avoiding extra message-consumer renders for latency changes.

Import `useActivityPerformance`, `getActivityStartupTimings`, and `subscribeActivityStartupTimings` from `ludicord/runtime`, `ludicord/activity`, or `ludicord`. Calling the hook opts into frame sampling; `enabled: false` stops it, and `sampleIntervalMs` controls publication frequency (default 1000ms). Sampling pauses while hidden and cleans up on unmount. FPS measures animation-frame callback frequency, not GPU paint performance or server ticks.

## Upgrade

Update with `npm install ludicord@4.2.0`, update your lockfile, and rebuild your production Activity. Newly generated projects use Ludicord `^4.2.0`. Existing 4.x applications retain their routes, authentication, shared-state behavior, and UI. See [WebSockets](https://ludicord.extra.codes/docs/websockets), [development and performance](https://ludicord.extra.codes/docs/development), and [configuration](https://ludicord.extra.codes/docs/configuration).
