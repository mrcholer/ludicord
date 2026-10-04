# Development runtime

> Documentation for Ludicord 4.2.1. See [release status](../releases/README.md).


`ludicord dev` owns the HTTP server, API routes, WebSockets, React hot updates, and diagnostics. It binds and announces the local URL before the initial compilation, then reports a clear `listening` → `compiling` → `ready` lifecycle. Requests wait for that first compilation instead of racing an incomplete server:

```text
compiling app/home/embed.tsx
compiled app/home/embed.tsx (24ms)
```

After the compiler is ready, V4 prints a table labeling PAGE, HTTP, SOCKET and EMBED routes. This is the authoritative development mapping for root and nested Activity scopes.

Saving an API/WS route or one of its local imports rebuilds the shared server module graph in place. The HTTP process and port remain running. Existing sockets close with code 1012 and reconnect using the configured backoff. The new handler is active after compilation succeeds; a failed compile keeps the last working graph and displays its error. Adding/removing routes refreshes manifests and types automatically.

If the first compilation fails, the listener remains available and serves the mapped error panel. Fixing the source triggers compilation again without restarting the command. Expected compiler cancellation during a controlled restart or shutdown is suppressed instead of appearing as an application failure.

Server module-level memory resets when that graph is replaced. Use a database or external store for state that must survive development edits, restarts, or multiple server replicas. Page, embed, shared-component and CSS edits use React Fast Refresh and normally preserve component state when hook signatures stay compatible, along with the pathname and hash. Route additions, removals, renames and moves regenerate manifests and declarations; structural changes may reload the document at its current URL. A failed first module import uses an automatic document reload after a fix because browsers cache rejected imports. These reloads may reset client state, but do not restart the server.

Ludicord's development panel handles syntax, TypeScript, render, event-handler, promise, API, and WS errors. It shows the exact file, line, column, highlighted source excerpt, server stack, and React component stack when available. Its header and footer remain fixed while content scrolls; source frames and call stacks can scroll horizontally without exposing native scrollbar chrome. The panel supports minimize, copy, truthful retry, keyboard paging, editor links protected by the current dev-run token, documentation deep links configured through `LUDICORD_DOCS_ORIGIN`, and automatic recovery. No development panel or client source maps are included in production builds; production fallbacks receive sanitized errors.

`--open` opens the local preview; `--debug` adds server stack details; `--no-hmr` disables browser hot updates. Ludicord watches `ludicord.config.mjs` and supported development environment files and performs a controlled restart after they change. Restart manually after changing installed dependencies. Re-authorize Discord after changing OAuth scopes. Prefix, API/WS, and embed source edits recover without restarting the HTTP process.

Successful server graph rebuilds remove obsolete temporary bundles; failed rebuilds keep the last working graph. The current run directory is removed on shutdown. Vite remains an internal compiler, not a separate developer-facing server. `vite.config.ts` is unnecessary and ignored. Tailwind is detected when `@tailwindcss/vite` is installed in the app.

Run `ludicord routes` to inspect recursive page and embed ownership, `ludicord info` for environment and project details, `ludicord lint` for React Hooks rules, and `ludicord build` for the complete production validation and client-secret scan.

## Startup measurements

### Performance data for your own UI

These data APIs are available in Ludicord 4.2.0. They render no panel, widget, or overlay and send no telemetry.

```tsx
import { useActivityPerformance } from "ludicord/runtime";

const performanceData = useActivityPerformance({
  enabled: showMyMetrics,
  sampleIntervalMs: 1_000,
});
// Your component chooses how to display performanceData.
```

Calling the hook opts into animation-frame sampling. `enabled: false` stops sampling and clears frame values. `sampleIntervalMs` accepts integers from 100 to 60000 and defaults to 1000. Sampling stops while hidden and resets when visible; React updates only when a sample is ready, rather than every frame. Strict Mode and unmount clean up the listener and pending frame request.

The result contains `enabled`, `fps`, `frameTimeMs`, `sampledFrames`, and `startup`. Frame values are `null` until a sample is available, while hidden, or when disabled. FPS measures animation-frame callback frequency, not GPU paint performance or server ticks. Startup data is independent of the frame-sampling toggle and contains only framework stage names, start/duration milliseconds, and `complete`, `error`, or `skipped` outcomes. Overlapping stages should not be added together.

Use `getActivityStartupTimings()` and `subscribeActivityStartupTimings(listener)` from `ludicord/runtime` for non-React consumers; subscriptions return cleanup. Snapshots are immutable, bounded, and reset for a new generated page scope. The hook returns empty startup data during server rendering. The same performance APIs are exported by `ludicord/activity` and the root `ludicord` entry point. Use `useWSDiagnostics()` from `ludicord/ws/client` for connection data alongside these samples.

Generated Activity entries record local User Timing measures in development and production. Record an opening in the browser's Performance panel, or inspect them in the console:

```js
console.table(performance.getEntriesByType("measure")
  .filter(entry => entry.name.startsWith("ludicord:startup:"))
  .map(entry => ({
    stage: entry.name.replace("ludicord:startup:", ""),
    startMs: Math.round(entry.startTime),
    durationMs: Math.round(entry.duration),
    status: entry.detail?.status,
  })));
```

| Measure | Meaning |
| --- | --- |
| `runtime` | Time from document navigation until the generated entry begins executing, including entry downloads and imported runtime evaluation. |
| `scope` | Preparation of the selected page's layout, loading UI, metadata, and route registry. |
| `page-module` | Import and evaluation of the selected page module, started alongside scope preparation. |
| `discord` | Discord initialization after the Activity mounts. |
| `auth` | Authentication after Discord initialization; skipped when initialization returns without a session. |
| `embed-module` | Import and evaluation of the first requested embed module. |
| `root-commit` | Navigation to the first React root effect, which may still show a loading screen. |
| `content-commit` | Navigation to the first committed Activity content after its sign-in gate allows rendering. An embed may still be loading. |
| `embed-commit` | Navigation to the first committed embed subtree, including its layouts. |

Stage measures have `detail.status` of `complete`, `skipped`, or `error`. Only stages actually reached are recorded; for example, failed Discord initialization does not produce an authentication measure. Commit milestones use React effects and do not claim to measure browser paint. Use browser network/resource timings to separate download time from module evaluation; deferred modules and shared imports can overlap, so these durations should not be added together.

Measures are recorded once per entry boot, including under React Strict Mode. HMR entry disposal prevents old asynchronous imports from mounting a stale root or finishing stale measurements; the next entry clears only Ludicord's startup marks and measures. Later embed navigation does not overwrite opening measurements. These timings remain in the browser and are not sent to a server.
