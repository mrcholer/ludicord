# AI agent support

Ludicord keeps one canonical task skill at:

`skills/ludicord/SKILL.md`

Agent-specific files should only route an agent to that skill. This avoids
maintaining multiple copies of the same framework knowledge.

## Supported entry points

| Agent / runtime | Repository entry point | Notes |
| --- | --- | --- |
| OpenAI Codex and AGENTS.md-aware agents | `AGENTS.md` | Repository-wide instructions. |
| Claude Code | `CLAUDE.md` | Routes Claude to `AGENTS.md` and the canonical Ludicord skill. |
| Gemini CLI | `GEMINI.md` and `.agents/skills/ludicord/SKILL.md` | Gemini CLI supports the shared `.agents/skills/` workspace alias. |
| Cursor | `.agents/skills/ludicord/SKILL.md` | Cursor discovers Agent Skills from `.agents/skills/`. |
| GitHub Copilot | `.github/copilot-instructions.md` and `AGENTS.md` | Repository instructions plus the canonical Ludicord skill. |
| Windsurf / Cascade | `AGENTS.md` | Windsurf supports repository `AGENTS.md` instructions. |
| OpenCode | `.agents/skills/ludicord/SKILL.md` | OpenCode supports the shared Agent Skills layout. |
| Other Agent Skills-compatible tools | `.agents/skills/ludicord/SKILL.md` | Use the open `SKILL.md` format where supported. |
| Other coding agents | `AGENTS.md` + `skills/ludicord/SKILL.md` | Configure the agent to read these two files if it does not auto-discover them. |

## Maintenance rule

Do not copy the full contents of `skills/ludicord/SKILL.md` into `CLAUDE.md`,
`GEMINI.md`, Copilot instructions, Cursor rules, Windsurf rules, or another
agent-specific file.

When Ludicord conventions change, update the canonical skill once. Adapters
should remain small and stable.

## Why `.agents/skills/`

The `.agents/skills/` path is an interoperable project-level location supported
by multiple modern coding agents. The adapter stored there intentionally points
back to the existing `skills/ludicord/SKILL.md` so Ludicord has a single source
of truth.
