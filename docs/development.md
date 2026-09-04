# Development runtime

> Documentation for Ludicord 2.2.5. See [release status](../releases/README.md).


`ludicord dev` owns the HTTP server, API routes, WebSockets, React hot updates, and diagnostics. Terminal output is Ludicord-branded:

```text
compiling app/embeds/home/embed.tsx
compiled app/embeds/home/embed.tsx (24ms)
```

Saving an API/WS route or one of its local imports rebuilds the shared server module graph in place. The HTTP process and port remain running. Existing sockets close with code 1012 and reconnect using the configured backoff. The new handler is active after compilation succeeds; a failed compile keeps the last working graph and displays its error. Adding/removing routes refreshes manifests and types automatically.

Server module-level memory resets when that graph is replaced. Use a database or external store for state that must survive development edits, restarts, or multiple server replicas. Browser-only embed edits use React Refresh and normally preserve component state when hook signatures stay compatible.

Ludicord's development panel handles syntax, TypeScript, render, event-handler, promise, API, and WS errors. It shows file, line, column, source excerpt and optional stack, with dismiss/copy/retry controls. Saving corrected code clears recovered diagnostics. No development panel or client source maps are included in production builds; production fallbacks receive sanitized errors.

`--open` opens the local preview; `--debug` adds server stack details; `--no-hmr` disables browser hot updates. Changes to framework installation, `ludicord.config.mjs`, or OAuth/environment configuration require restarting dev. API/WS and embed source edits do not.

The compiler cache is isolated under each project's `.ludicord/cache`. Vite is still an internal compiler, not a separate developer-facing server. `vite.config.ts` is unnecessary and ignored. Tailwind is detected when `@tailwindcss/vite` is installed in the app.

Run `ludicord doctor` to check configuration, environment, security warnings, port availability, build compatibility and secret leakage. Run `ludicord routes` to inspect discovered routes.
