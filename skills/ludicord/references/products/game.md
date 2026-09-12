# Game Product Profile

Activate only when gameplay is central. Gameplay is evidenced by player
choices/actions inside a rules system with goals, rounds, score, win/loss,
simulation, challenge, progression, or equivalent mechanics.

Do not activate this profile because the app is realtime, has multiple users,
uses participants, uses shared state, or calls `useGameLoop()`.

## Before coding

Build an internal game design specification:

```yaml
game:
  genre:
  players:
  session_type:
  core_loop:
  goal:
  win_condition:
  loss_condition:
  states:
  controls:
  authority:
  state_model:
  synchronization:
  hud:
  menus:
  mobile_strategy:
  discord_layout_strategy:
  visual_direction:
  audio_direction:
  performance_budget:
  mvp_scope:
  non_goals:
```

Unknown/non-applicable fields can be marked explicitly; do not invent
requirements merely to fill the template.

## Load game detail references

- [`../game/architecture.md`](../game/architecture.md) for rules/state/simulation separation.
- [`../game/multiplayer.md`](../game/multiplayer.md) only when multiplayer/shared gameplay exists.
- [`../game/game-first-ui.md`](../game/game-first-ui.md) for play-surface composition.
- [`../game/testing.md`](../game/testing.md) before completion.

## Hard product rule

The game remains a game. Do not build:

```text
navbar → hero → feature cards → footer → game widget
```

unless the user explicitly requested a surrounding website/landing surface.
The play surface, controls, feedback, state, and game flow are primary.
