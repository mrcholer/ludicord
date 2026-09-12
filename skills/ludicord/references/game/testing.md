# Game Validation and Testing

Load only for game products/surfaces.

## Rules tests

Test legal and illegal actions, boundary cases, state transitions, win/loss,
draw/tie rules where relevant, and invariants that must never break.

## Multiplayer tests

When multiplayer exists, test:

- wrong turn / unauthorized actor;
- duplicate action;
- stale revision;
- simultaneous/racing actions;
- disconnect and reconnect;
- late join if supported;
- room isolation between Activity instances;
- invalid payload;
- server restart/durability behavior if the game promises recovery.

## UX tests

Test:

- keyboard/mouse/touch as applicable;
- portrait and landscape;
- compact/minimized Activity layout where relevant;
- loading/reconnect/error states;
- clear feedback for invalid actions;
- playability without relying on hover-only interaction.

## Performance

Measure before optimizing. Watch render frequency, animation work, WS event
volume, asset size, memory growth, and mobile/thermal behavior for realtime or
visual-heavy games.

## Framework gate

Game tests do not replace Ludicord validation. Finish with the applicable route,
hooks/type, production-build, browser, and Discord-frame checks from
[`../validation.md`](../validation.md).
