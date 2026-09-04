# Ludicord agent instructions

Before changing a Ludicord Activity, read [`skills/ludicord/SKILL.md`](skills/ludicord/SKILL.md) and the specific public guide it routes you to.

## Required behavior

- Preserve Ludicord's file conventions. Do not recreate Next.js conventions or expose Vite configuration.
- Do not manually import automatic layout, loading, error, minimize or auth UI files into `app/pages.tsx`.
- Keep one `LudicordActivity` and one `EmbedOutlet` in the Activity root.
- Name every embed file `embed.tsx` and default-export `function embed()`.
- Keep secrets and bot tokens in server-only environment variables. Never place them in client code or committed files.
- Do not edit generated `.ludicord/` output or `ludicord.generated.d.ts`; run the framework to regenerate them.
- Validate changes with `ludicord doctor`, `ludicord routes`, the project's typecheck, and `ludicord build`.
- Never publish packages, create releases, change repository security, or rotate credentials unless the user explicitly requests that action.

The public repository documents the framework and contains release distributions, not the private TypeScript implementation.
