# Ludicord Copilot instructions

Read `AGENTS.md` and `skills/ludicord/SKILL.md` before editing a Ludicord Activity or this public framework repository. Load only the canonical skill references relevant to the task.

- Verify every API against the Activity's installed `ludicord` declarations and `ludicord.generated.d.ts`.
- Preserve Ludicord file conventions, the persistent Activity root, typed embed navigation, and client/server security boundaries.
- Never import `ludicord/internal`, edit generated output, expose credentials, or invent Discord payload guarantees.
- Use React state for local UI and effects only for external synchronization with cleanup.
- Validate relevant routes and hooks, then run the production build.
- Do not publish, release, push, or change repository/security settings unless the user explicitly requests it.

The canonical skill wins if this adapter becomes stale.
