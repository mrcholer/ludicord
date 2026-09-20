# Page scopes and optional prefix navigation

> Documentation for Ludicord 4.0.0. See [release status](../releases/README.md).

## Choose the simplest structure

Start with one `app/page.tsx` and ordinary embeds. Add independent pathname pages only when a large project needs separate product surfaces, or an important requirement needs a distinct URL, shell or provider lifetime. Explain that reason before adding scopes. More screens, realtime, nested folders, or a v4 upgrade alone do not justify prefix architecture. Preserve a project's existing routing choices unless migration is requested.

## Unified route tree

V4 uses `page.tsx`, `route.ts`, `socket.ts`, and `embed.tsx` anywhere under `app/`, with at most one route file per directory. The pathname selects a page; the hash selects an embed owned by the nearest ancestor page. No literal `prefix/` folder is needed.

| File | URL |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/home/embed.tsx` | `/#/home` |
| `app/docs/page.tsx` | `/docs` |
| `app/docs/api/page.tsx` | `/docs/api` |
| `app/docs/api/auth/embed.tsx` | `/docs/api#/auth` |
| `app/game/[id]/page.tsx` | `/game/abc` |
| `app/game/[id]/players/embed.tsx` | `/game/abc#/players` |

The last embed belongs to `/game/:id`, not `/`. It can read `id` from `usePageParams()` or the merged `useEmbedParams()`. Dynamic embeds add their own parameters; page and embed parameter names must be distinct. Different pages can own the same local embed name.

## Navigation

```tsx
import { PrefixLink, prefixHref, useActivityPrefix } from "ludicord";
<PrefixLink prefix="/docs/api" embed="auth">API authentication</PrefixLink>;
const url = prefixHref("/game/abc", "players");
// /game/abc/#/players
```

The established `PrefixLink` and `prefixHref()` names now also target unified page paths. Cross-page navigation loads the destination document and remounts providers. Use `Link` or `useEmbedRouter()` inside the active page to retain its state. `useActivityPrefix()` returns the concrete pathname, such as `/game/abc`.

Read `ludicord.generated.d.ts` for page patterns, concrete route types, page parameter maps, and per-page embed maps. Never invent routes or edit generated types by hand.

## Imports and validation

Generated applications configure `imports.aliases` with `@/components`, `@/lib` and `@`. Alias targets stay inside the project. Update matching TypeScript paths when changing them.

Run `ludicord routes`, `ludicord lint`, and `ludicord build`. Route output labels PAGE, HTTP, SOCKET and EMBED. Test direct dynamic page URLs and scoped hashes. Unknown production routes return 404. Ambiguous route patterns, duplicate parameters, conflicting route files, embeds without an ancestor page, and the reserved `/_ludicord` namespace fail validation.

Legacy `pages.tsx` and recursive `prefix/` projects use compatibility mode. Follow the [migration guide](migration-v4.md) when adopting unified routing; do not mix conventions.
