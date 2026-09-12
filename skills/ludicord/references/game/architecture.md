# Game Architecture

Load only for a product/surface classified as a game.

## Separate responsibilities

Keep these concepts separable even if a small game stores them in few files:

```text
rules
state
state transitions
actions/input
simulation/timing
networking
authority
rendering/UI
Discord integration
persistence
```

Do not bury core rules inside React click handlers or visual components.

## State machine

For games with discrete phases, define explicit states and legal transitions.
Example shape:

```text
LOBBY → READY → PLAYING → GAME_OVER
             ↘ PAUSED ↗
```

Transitions should state:

- who may trigger them;
- required preconditions;
- state mutations;
- side effects;
- network broadcast/persistence requirements.

## Rules engine

Rules should be testable without rendering when practical. A rule decision
should not depend on DOM state or animation completion unless that is actually
part of the game mechanic.

## Timing

Use frame-based work only when the game needs it. Turn-based games generally do
not need a continuous simulation loop. Realtime simulation should define its
clock, update strategy, pause/background behavior, and performance budget.
