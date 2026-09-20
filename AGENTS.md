# Ludicord agent instructions

Before changing a Ludicord Activity, read [`skills/ludicord/SKILL.md`](skills/ludicord/SKILL.md) completely. For non-trivial product work, route through the skill's product/intent classifier first, then read only the product, capability, and framework references it selects. The exact installed package declarations and generated route declarations are the API authority for an application.

## Required behavior

- Classify the requested experience before selecting optional architecture: game, dashboard, collaborative app, social app, media app, utility, or general Activity. Realtime, multiple participants, shared state, and `useGameLoop()` do not by themselves make a product a game.
- Preserve the existing product shape unless the user explicitly requests a redesign. Do not force game patterns onto normal apps or generic SaaS/dashboard patterns onto games and focused experiences.
- Select capabilities independently from product type. Add realtime, persistence, Discord context, server authority, or privileged data access only when the requested behavior requires them.
- Preserve Ludicord's file conventions. Unified routing uses `page.tsx` for pathname UI, `route.ts` for HTTP, `socket.ts` for WebSockets, and `embed.tsx` for hash screens owned by the nearest page. Keep at most one route file in a directory.
- Do not manually import automatic layout, loading, error, minimize, or auth UI files into `app/page.tsx`.
- A plain `page.tsx` receives an automatic Activity boundary. Mount an explicit `LudicordActivity` only when the page needs local boundary configuration, and render one `EmbedOutlet` when that page owns embeds.
- Default to one root page with ordinary embeds. Add another `app/<path>/page.tsx` scope only when a large project has separate surfaces or an important requirement needs distinct URLs, shells, or provider lifetimes. Explain that concrete reason first.
- Use generated page ownership types, `PrefixLink` between justified pathname scopes, and the embed router inside one page. Folder names such as `api`, `ws`, `embeds`, and `prefix` are ordinary URL segments in unified mode.
- Read `imports.aliases` before adding deep imports and keep the matching TypeScript `paths` configuration synchronized.
- Name every embed file `embed.tsx` and default-export `function embed()`.
- Preserve root `app/pages.tsx` projects in legacy compatibility mode unless a complete v4 migration is requested. Do not mix unified `page.tsx` or `socket.ts` files into that legacy tree.
- Keep secrets and bot tokens in server-only environment variables. Never place them in client code or committed files.
- Do not edit generated `.ludicord/` output or `ludicord.generated.d.ts`; run the framework to regenerate them.
- Keep normal React state local. Use effects only for external synchronization with cleanup; use Ludicord storage, query, presence, game-loop, or shared-state hooks only when their framework-owned lifecycle is required.
- Generated projects expose `dev`, `build`, and `start`. For relevant changes, run advanced `routes`, `lint`, `analyze`, `info`, or `clean` commands directly through the installed CLI; always finish runtime changes with a production build.
- Treat `ludicord/internal` as compiler-owned and unsupported in applications.
- Never publish packages, create releases, change repository security, or rotate credentials unless the user explicitly requests that action.

This public repository documents the framework and contains approved release distributions, machine-readable compatibility records, and reusable agent guidance—not the private TypeScript implementation. Keep version notes under `releases/v<major>/`, keep `releases/latest.md` and `types/latest.json` synchronized with `.release/current.json`, and run `node scripts/validate-public-repo.mjs` after public-repository changes.

The npm package places its short discovery file at `node_modules/ludicord/AGENTS.md`, like Next.js. That file points to version-matched guides in `dist/docs/` and the skill in `dist/skills/ludicord/`.
