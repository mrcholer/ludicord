# Development runtime

> Documentation for Ludicord 4.0.0. See [release status](../releases/README.md).


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

Run `ludicord routes` to inspect recursive prefix ownership and all discovered routes, `ludicord info` for environment and project details, `ludicord lint` for React Hooks rules, and `ludicord build` for the complete production validation and client-secret scan.
