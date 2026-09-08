---
name: ludicord
description: Work on the Ludicord Discord Activity framework, including its public API, documentation, guides, examples, release history, migrations, troubleshooting, and support.
---

# Ludicord

This is a cross-agent discovery adapter.

The canonical Ludicord skill lives at:

`../../../skills/ludicord/SKILL.md`

Before doing Ludicord work:

1. Read `../../../skills/ludicord/SKILL.md` completely and follow it.
2. Read `../../../AGENTS.md` for repository-wide instructions.
3. Inspect the Activity's installed `ludicord` version, exported declarations,
   and `ludicord.generated.d.ts` before writing framework API calls.
4. Treat the canonical skill as the source of truth if this adapter ever
   disagrees with it.
5. Keep reusable Ludicord knowledge in the canonical skill instead of
   duplicating it in agent-specific files.

This adapter exists so Agent Skills-compatible runtimes can discover the
existing Ludicord skill from the interoperable `.agents/skills/` location.
