# Migrating to Ludicord 4.0.0

Check npm availability before changing production dependencies. Keep a deployable build and lockfile, record existing URLs and Discord mappings, and validate the migration in a branch.

## Move to unified routing

| Legacy file | Unified file | Preserved route |
| --- | --- | --- |
| `app/pages.tsx` | `app/page.tsx` | `/` |
| `app/embeds/home/embed.tsx` | `app/home/embed.tsx` | `/#/home` |
| `app/api/hello/route.ts` | same | HTTP `/api/hello` |
| `app/ws/presence/route.ts` | `app/ws/presence/socket.ts` | WS `/ws/presence` |
| `app/prefix/docs/pages.tsx` | `app/docs/page.tsx` | `/docs` |
| `app/prefix/docs/embeds/start/embed.tsx` | `app/docs/start/embed.tsx` | `/docs#/start` |

1. Rename the root page and move embed folders beside it. Remove repeated structural `prefix/` and `embeds/` folders while preserving their intended paths.
2. Rename WebSocket `route.ts` files to `socket.ts`; keep their `defineWS` exports. HTTP `route.ts` files keep named method exports.
3. Keep at most one of `page.tsx`, `route.ts`, `socket.ts`, and `embed.tsx` in each directory. Put endpoints in a named child directory if a page owns the original path.
4. Preserve existing public API/socket paths by retaining ordinary `api` and `ws` directory names. They are optional URL segments, not special routing roots. `useWS()` now uses the supplied path exactly: change shorthand `useWS("presence")` to `useWS("/ws/presence")` if that is the actual endpoint.
5. Update relative imports, documentation, tests, bookmarks and Discord URL mappings for any intentional URL changes. Keep configured aliases and TypeScript paths aligned.
6. Run `ludicord routes`, lint, the project's typecheck and `ludicord build`. Check dynamic pages, nearest-page embeds, back/forward, authenticated HTTP/socket calls, and production direct URLs.

## Compatibility

A project with root `app/pages.tsx` keeps the legacy scanner, including the old `app/embeds`, `app/api`, `app/ws/**/route.ts`, and optional recursive prefixes. A project using `page.tsx` uses unified routing. Do not leave both root names or mix new route files into a legacy tree. The CLI reports conflicting conventions. A `defineWS()` handler in unified `route.ts` must move to `socket.ts`.

Keep a single page and embeds unless project scale or a specific URL/shell requirement justifies more pages. Upgrading does not require splitting the application.

## Development and production

Page, embed, component and CSS saves use Vite/React Fast Refresh and preserve compatible state. Structural route changes refresh the registry and may reload the current URL/hash. A failed first module import may require an automatic document reload after a fix because browsers cache rejected imports. API/socket saves rebuild the server graph; sockets close with 1012 and reconnect. Module-level server memory resets. Config/environment changes may restart the server. Production has no development watcher, HMR client or diagnostics panel.

Installed v4 guidance starts at `node_modules/ludicord/AGENTS.md`, with detailed guides in `dist/docs/` and the reusable skill in `dist/skills/`. The package-root file follows the Next.js discovery pattern; no agent file is added to generated projects.
