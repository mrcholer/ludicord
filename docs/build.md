# Build

> Documentation for Ludicord 2.2.5. See [release status](../releases/README.md).


```bash
ludicord build
```

The production compiler validates `app/pages.tsx`, scans routes, generates manifests and route types, typechecks the project, builds a hashed React client with lazy embed chunks, bundles API and WebSocket routes together for Node with shared chunks, copies `public`, writes safe build metadata, and scans client assets for actual server secrets.

Output is written only to `.ludicord/`:

```text
.ludicord/
  build.json
  client/
  manifests/
  server/api/
  server/ws/
  server/shared/
  types/
```

The output directory is removed before a new build and removed again after a failed build. `ludicord clean` deletes only the project `.ludicord` directory. Build metadata includes public configuration and booleans, never the Client Secret, Session Secret, bot token, or OAuth access tokens.

Ludicord loads `.env`, `.env.local`, and production-mode environment files before configuration. Explicit shell values take precedence. CSS is linked in the generated HTML, and the secret scanner includes large/binary public assets. Avoid placing any credentials in `public/`.

Vite remains an internal compiler dependency; the CLI and diagnostics are Ludicord-branded. You do not need `vite.config.ts`, and it is not loaded. A locally installed `@tailwindcss/vite` is discovered automatically.
