# Project Structure

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


```text
app/
  pages.tsx                 persistent Activity root
  globals.css
  layout.tsx                optional project layout
  loading.tsx               optional loading UI
  error.tsx                 optional error UI
  minimize.tsx              optional compact Activity UI
  auth/                     auth loading/error/denied UI
  embeds/<route>/embed.tsx  internal embed screens
  prefix/<segment>/         optional pathname-owned Activity scope
    pages.tsx               required root for that prefix
    embeds/<route>/embed.tsx
    prefix/<segment>/       recursively nested prefix scope
  api/<route>/route.ts      HTTP endpoints
  ws/<route>/route.ts       WebSocket endpoints
components/                 shared React components
lib/                        shared application code
public/                     copied static assets
ludicord.config.mjs             framework configuration
ludicord-env.d.ts               ambient and generated type reference
ludicord.generated.d.ts         generated route/config registry
.ludicord/                      disposable production output
```

Dynamic directory names use `[id]`, `[...slug]`, and `[[...slug]]` for embeds, API routes, and WebSocket routes. Prefix segments are intentionally static and URL-safe; dynamic, grouped, dot-prefixed, and reserved `/_ludicord` prefixes are rejected.

Each `prefix/<segment>` directory creates a pathname scope and must contain its own `pages.tsx`. Its embeds are local to that scope, and another nested `prefix/` directory continues the same convention recursively. Read [V4 Prefix Router](prefix-router.md) for the complete tree and URL mapping.

V4 also maps `@/` to the project root in browser and server compilation. Use `@/components/...` and `@/lib/...` instead of depth-sensitive relative imports from deeply nested scopes.
