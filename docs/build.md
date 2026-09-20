# Build

> Documentation for Ludicord 4.0.1. See [release status](../releases/README.md).


```bash
ludicord build
```

The production compiler validates every discovered `page.tsx` and the four-file exclusivity rule, scans scoped embeds and server routes, generates manifests and route types, typechecks the project, builds a hashed React client with lazy page/embed chunks, bundles API and WebSocket routes together for Node with shared chunks, copies `public`, writes safe build metadata, and scans client assets for actual server secrets.

Output is written only to `.ludicord/`:

```text
.ludicord/
  build.json
  client/
  manifests/
    prefix-manifest.json
  server/api/
  server/ws/
  server/shared/
  types/
```

Production output is assembled in a temporary directory and replaces `.ludicord/` atomically only after the build succeeds. A failed build removes its temporary output and preserves the last usable production build. `ludicord clean` deletes only the project `.ludicord` directory. Build metadata includes public configuration and booleans, never the Client Secret, Session Secret, bot token, or OAuth access tokens.

Ludicord loads `.env`, `.env.local`, and production-mode environment files before configuration. Explicit shell values take precedence. CSS is linked in the generated HTML, and the secret scanner includes large/binary public assets. Avoid placing any credentials in `public/`.

Build schema 4 records every exact production prefix. The production server serves only paths in that manifest and returns 404 for unknown prefixes. Vite remains an internal compiler dependency; the CLI and diagnostics are Ludicord-branded. You do not need `vite.config.ts`, and it is not loaded. A locally installed `@tailwindcss/vite` is discovered automatically.
