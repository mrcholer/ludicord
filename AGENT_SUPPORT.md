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
| Cursor | `.cursor/rules/ludicord.mdc` and `.agents/skills/ludicord/SKILL.md` | Always-on routing rule plus the shared Agent Skill. |
| GitHub Copilot | `.github/copilot-instructions.md` and `AGENTS.md` | Repository instructions plus the canonical Ludicord skill. |
| Google Antigravity | `.agents/rules/ludicord.md` and `.agents/skills/ludicord/SKILL.md` | Workspace rule plus the shared Agent Skill. |
| Windsurf / Cascade | `AGENTS.md` | Windsurf supports repository `AGENTS.md` instructions. |
| OpenCode | `.agents/skills/ludicord/SKILL.md` | OpenCode supports the shared Agent Skills layout. |
| Other Agent Skills-compatible tools | `.agents/skills/ludicord/SKILL.md` | Use the open `SKILL.md` format where supported. |
| Other coding agents | `AGENTS.md` + `skills/ludicord/SKILL.md` | Configure the agent to read these two files if it does not auto-discover them. |

## Layered skill architecture

The single canonical skill now uses progressive disclosure. Its routing and
product intelligence lives under `skills/ludicord/references/` and is loaded
only when relevant. These reference files are subordinate to
`skills/ludicord/SKILL.md`; they are not competing canonical skills.

The routing order is:

```text
user intent
→ existing project analysis
→ primary product profile
→ independent capability selection
→ Ludicord subsystem references
→ implementation
→ product + framework validation
```

This prevents optional domain guidance from hijacking unrelated work. In
particular, realtime, multiple participants, shared state, or the game-loop
primitive do not automatically activate game design guidance. The machine-readable
index is `skills/ludicord/manifest.yaml`, and the human-readable map is
`skills/ludicord/knowledge-map.md`.

## Maintenance rule

Do not copy the full contents of `skills/ludicord/SKILL.md` into `CLAUDE.md`,
`GEMINI.md`, Copilot instructions, Cursor rules, Windsurf rules, or another
agent-specific file.

When Ludicord conventions change, update the canonical skill or the routed
reference that owns that knowledge. Agent-specific adapters should remain
small and stable. Do not duplicate the routed reference tree into adapter files.

All adapters enforce the same authority order: installed package version,
installed declarations, generated route declarations, matching public docs,
then general model knowledge. This prevents an agent from mixing unpublished
or older framework behavior into an Activity.

## Why `.agents/skills/`

The `.agents/skills/` path is an interoperable project-level location supported
by multiple modern coding agents. The adapter stored there intentionally points
back to the existing `skills/ludicord/SKILL.md` so Ludicord has a single source
of truth.
