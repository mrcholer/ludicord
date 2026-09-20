# Project structure

> Documentation for Ludicord 4.0.1. See [release status](../releases/README.md).

The `app/` tree is the router. These four files define routes:

| File | Route |
| --- | --- |
| `page.tsx` | React page at its directory's pathname |
| `route.ts` | HTTP endpoint exporting named method handlers |
| `socket.ts` | WebSocket endpoint exporting `defineWS(...)` |
| `embed.tsx` | Hash screen owned by the nearest ancestor page |

Each directory can contain **at most one** of these four files. A page and an endpoint must use different directories. Ordinary components, CSS and automatic UI files may coexist with the route file.

```text
app/
  page.tsx                    /
  home/embed.tsx              /#/home
  profile/[userId]/embed.tsx   /#/profile/alex
  game/[id]/page.tsx          /game/abc
  game/[id]/players/embed.tsx /game/abc#/players
  game/[id]/info/route.ts     HTTP /game/abc/info
  game/[id]/live/socket.ts    WebSocket /game/abc/live
  globals.css
  layout.tsx                  optional layout for the root page
  loading.tsx                 optional loading fallback
  error.tsx                   optional error boundary
  minimize.tsx                optional compact Activity UI
  auth/                       optional auth loading/error/denied UI
components/                   shared React components
lib/                          shared application code
public/                       static assets
ludicord.config.mjs            framework configuration
ludicord.generated.d.ts        generated route and parameter types
.ludicord/                    generated build output
```

There are no required `api/`, `ws/`, `embeds/` or `prefix/` folders in unified mode. If present, they are ordinary URL segments. Directories without route files do not create routes. `[id]` captures a dynamic parameter; existing route groups and catch-all patterns remain supported. The `/_ludicord` namespace is reserved.

Start with one root page and embeds. Add independent pathname pages only for a large project's separate surfaces or a concrete requirement such as a shareable resource URL. See [page scopes](prefix-router.md) and [migration](migration-v4.md) for legacy conventions.

Generated projects configure `@/` imports. Keep Ludicord's import aliases and TypeScript paths synchronized.
