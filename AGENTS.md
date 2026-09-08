# Ludicord agent instructions

Before changing a Ludicord Activity, read [`skills/ludicord/SKILL.md`](skills/ludicord/SKILL.md) completely and then read only the subsystem references it routes you to. The exact installed package declarations and generated route declarations are the API authority for an application.

## Required behavior

- Preserve Ludicord's file conventions. Do not recreate Next.js conventions or expose Vite configuration.
- Do not manually import automatic layout, loading, error, minimize or auth UI files into `app/pages.tsx`.
- Keep one `LudicordActivity` and one `EmbedOutlet` in the Activity root.
- Name every embed file `embed.tsx` and default-export `function embed()`.
- Keep secrets and bot tokens in server-only environment variables. Never place them in client code or committed files.
- Do not edit generated `.ludicord/` output or `ludicord.generated.d.ts`; run the framework to regenerate them.
- Keep normal React state local. Use effects only for external synchronization with cleanup; use Ludicord storage, query, presence, game-loop, or shared-state hooks only when their framework-owned lifecycle is required.
- Generated projects expose `dev`, `build`, and `start`. For relevant changes, run advanced `routes`, `lint`, `analyze`, `info`, or `clean` commands directly through the installed CLI; always finish runtime changes with a production build.
- Treat `ludicord/internal` as compiler-owned and unsupported in applications.
- Never publish packages, create releases, change repository security, or rotate credentials unless the user explicitly requests that action.

This public repository documents the framework and contains approved release distributions, machine-readable compatibility records, and reusable agent guidance—not the private TypeScript implementation. Keep version notes under `releases/v<major>/`, keep `releases/latest.md` and `types/latest.json` synchronized with `.release/current.json`, and run `node scripts/validate-public-repo.mjs` after public-repository changes.
