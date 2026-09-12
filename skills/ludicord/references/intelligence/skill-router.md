# Skill Router

Use this reference before selecting optional product, game, realtime, or UI
guidance. Its job is to prevent an implementation detail from redefining the
product.

## Non-negotiable invariants

- **Realtime does not imply game.** A collaborative editor, watch party, live
  dashboard, chat, shared canvas, or presence view can be realtime without
  gameplay.
- **Multiplayer does not imply game.** Multiple participants can collaborate
  on a non-game task.
- **Shared state does not imply game.** Shared state is a data requirement.
- **Discord participants do not imply game.** They are context.
- **Using `useGameLoop()` does not classify the product as a game.** The hook
  is an implementation primitive for animation-frame work.
- **Do not activate the game profile unless gameplay is explicit or strongly
  evidenced by rules, goals, rounds, player actions, scoring, win/loss,
  simulation, or equivalent mechanics.**
- **Do not force SaaS/dashboard composition onto games, media experiences,
  focused utilities, or simple content apps.**
- **Do not gamify a normal app unless the user asks for gamification.**
- **Do not redesign an existing product merely because another product profile
  would be easier to implement.**

## Routing algorithm

### 1. Extract the actual user outcome

Write one internal sentence that starts with:

```text
The user wants participants to...
```

Describe the outcome, not the technology. "Use WebSockets" is not an outcome.
"Edit the same board together and see changes immediately" is.

### 2. Inspect the existing project

For an existing app, follow [`project-analysis.md`](project-analysis.md). The
current product shape is evidence. Do not reclassify a dashboard as a game
because a new feature adds points, or a game as a dashboard because it needs a
settings screen.

### 3. Choose one primary product profile

Choose the narrowest profile that explains the **main experience**:

| Product profile | Activate when the core experience is... |
| --- | --- |
| `general-activity` | App/site/content/forms/docs/product experience without a narrower dominant shape |
| `dashboard` | Managing, moderating, operating, configuring, or analyzing data |
| `collaborative-app` | Multiple people changing or coordinating around the same artifact/task |
| `social-app` | Participant-to-participant interaction, social presence, profiles, feed/community behavior |
| `media-app` | Watching, listening, browsing, presenting, or controlling media |
| `utility` | Completing one focused task efficiently |
| `game` | Playing a rules-driven experience with gameplay mechanics |

If the request is ambiguous, use `general-activity` rather than inventing a
specialized product. Ask only when the ambiguity would materially change the
result and cannot be resolved from the repository or user request.

### 4. Add a secondary profile only for a true hybrid

A secondary profile is justified only when two experiences are independently
first-class. Examples:

- collaborative drawing app + social profiles: primary `collaborative-app`,
  secondary `social-app` only if profiles/social interaction are substantial;
- game with an admin dashboard: primary `game`, dashboard guidance only for the
  admin surface;
- media watch party: primary `media-app`, collaborative/realtime capability as
  needed.

Do not call something hybrid merely because it uses multiple technologies.

### 5. Derive capabilities independently

Follow [`capability-routing.md`](capability-routing.md). Typical capability
questions:

```text
Does it need realtime synchronization?
Does data need persistence?
Does it need server authority?
Does it need Discord participant/guild/channel/voice/layout data?
Does it need API routes?
Does it need authentication or authorization beyond framework defaults?
Does it need offline/local state only?
```

Select capabilities because the experience needs them, not because a profile
usually has them.

### 6. Load only relevant references

Always keep the canonical Ludicord rules active. Then load:

1. one primary product profile;
2. capability references that are actually needed;
3. existing Ludicord subsystem references required for implementation;
4. game detail references **only** when the primary or relevant surface is a
   game.

### 7. Produce an implementation contract

For non-trivial work, use
[`implementation-contract.md`](implementation-contract.md) before editing.

### 8. Validate product fidelity and framework correctness separately

Use [`validation-gates.md`](validation-gates.md). A build can pass while the
product is architecturally wrong; both gates matter.

## Examples

### Shared drawing canvas

```yaml
product: collaborative-app
capabilities:
  realtime: true
  persistence: optional
  discord_context: participants-if-needed
game: false
```

Do not load game rules, scoring, matchmaking, win/loss, or game-first UI.

### Community moderation panel

```yaml
product: dashboard
capabilities:
  api: true
  persistence: true
  authz: true
  realtime: only-if-live-updates-are-required
game: false
```

### Watch party

```yaml
product: media-app
secondary: collaborative-app-if-shared-controls-are-core
capabilities:
  realtime: shared-playback-only-if-required
  discord_context: participants-if-displayed
game: false
```

### Multiplayer chess

```yaml
product: game
capabilities:
  realtime: true
  server_authority: true
  persistence: optional-by-session-design
  discord_context: participants
load_game_details:
  - architecture
  - multiplayer
  - game-first-ui
  - testing
```
