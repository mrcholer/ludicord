# Game-First UI

Load only for game surfaces.

## Composition priority

A typical play surface prioritizes:

```text
gameplay viewport / board / arena
→ immediate controls and feedback
→ essential HUD
→ secondary status
→ menus/settings
```

The exact order changes by genre, but gameplay remains primary.

## Rules

- Do not wrap a game in generic SaaS dashboard chrome by default.
- Do not spend the majority of the viewport on cards that describe the game
  while the playable surface is secondary.
- Keep interaction feedback close to the action: selected state, legal targets,
  cooldown/timing, invalid action, success/failure, turn/phase, win/loss.
- Respect Discord safe areas, portrait/landscape, compact layouts, and touch.
- Build responsive composition, not just responsive CSS widths.
- Minimized/PiP UI should show only information/actions useful in that state.

## Game feel

A technically valid action still needs response:

```text
input
→ immediate acknowledgement
→ transition/animation where useful
→ authoritative result
→ clear state/turn/score feedback
```

Do not add animation that delays required input or hides authoritative state.
