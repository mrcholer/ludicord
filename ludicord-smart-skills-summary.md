# Ludicord Smart Skills Patch

Generated against the current `mrcholer/ludicord` `main` agent files reviewed on 2026-09-12.

## What it changes

The patch preserves Ludicord's single canonical skill at `skills/ludicord/SKILL.md` and adds progressively disclosed routing/reference layers instead of creating competing skills.

### Modified

- `AGENTS.md`
- `AGENT_SUPPORT.md`
- `skills/ludicord/SKILL.md`
- `scripts/validate-public-repo.mjs`

### Added

- `skills/ludicord/manifest.yaml`
- `skills/ludicord/knowledge-map.md`
- intelligence references for routing, project inspection, capability selection, source authority, conflict resolution, scope, implementation contracts, and validation gates
- product profiles for general Activities, dashboards, collaborative apps, social apps, media apps, utilities, and games
- capability profiles for realtime, persistence, and Discord context
- game-only references for architecture, multiplayer, game-first UI, and testing

## Key invariants

- Realtime does not imply game.
- Multiplayer does not imply game.
- Shared state does not imply game.
- `useGameLoop()` does not imply game.
- Game guidance activates only for actual gameplay.
- Framework knowledge does not dictate product design.
- Existing product shape is preserved unless the user requests redesign.
- Capabilities are selected independently from product type.
- Installed package declarations remain the API authority.

## Apply

From the root of `mrcholer/ludicord`:

```bash
git apply --check ludicord-smart-skills.patch
git apply ludicord-smart-skills.patch
node scripts/validate-public-repo.mjs
```

Then inspect:

```bash
git diff --stat
git diff
```

## Checks performed while generating

- `git diff --check`
- patch re-application with `git apply --check`
- relative Markdown links in the added skill tree
- all `manifest.yaml` `path:` targets
- required anti-hijack router invariants

The full repository validator must be run in the real Ludicord checkout because the working environment used to construct this patch did not contain the rest of the repository payload.
