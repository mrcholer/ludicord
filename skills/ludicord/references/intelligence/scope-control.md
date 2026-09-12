# Scope Control

Professional implementation is not maximal implementation. Build the smallest
complete product change that satisfies the request and leaves clean extension
points.

## Required behavior

- Separate **requested**, **required**, **helpful**, and **future** features.
- Implement requested + technically required work.
- Add helpful work only when it is small, clearly beneficial, and does not
  create a new subsystem.
- Keep future ideas out of the implementation unless the user asked for them.
- Do not add ranking, analytics, admin panels, chat, shops, achievements,
  social profiles, persistence, realtime, AI, matchmaking, or extra roles just
  because they are common in similar products.
- Do not introduce a dependency when the existing stack can solve the problem
  cleanly.
- Do not create files "for later" that are unused now.

## Product-specific scope

### Game

Start with the playable core loop, rules, state, input, and minimum required
multiplayer/Discord integration. Spectators, rankings, cosmetics, replays,
matchmaking, and stores are separate scopes unless requested.

### Dashboard

Start with the required operational views/actions. Do not automatically add
analytics, exports, role systems, notification centers, or command palettes.

### Collaborative app

Start with the shared artifact/task and the minimum synchronization/conflict
model. Do not automatically add comments, history, cursors, presence avatars,
or permissions beyond what the task requires.

### Utility / general Activity

Prefer direct task completion over navigation depth, account systems, complex
shells, or marketing-style sections.

## Stop condition

The change is complete when the requested outcome works, relevant edge cases
are handled, required validation passes, and no unrequested subsystem is needed
for correctness.
