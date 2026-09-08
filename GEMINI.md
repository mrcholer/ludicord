# Ludicord — Gemini CLI instructions

Use `AGENTS.md` as the repository-wide instruction file.

When working on Ludicord, activate and read the project skill exposed through
`.agents/skills/ludicord/SKILL.md`. That adapter delegates to the canonical
skill at `skills/ludicord/SKILL.md`.

The canonical skill is the source of truth for Ludicord-specific workflows,
API conventions, examples, documentation, release-history work, and support
tasks. Do not duplicate it here.

Before submitting changes, inspect the installed framework version and
declarations, keep edits small and reviewable, preserve existing public
API/documentation conventions, and run the repository's documented checks.
Do not invent exports, route names, Discord payload guarantees, or future
release behavior.
