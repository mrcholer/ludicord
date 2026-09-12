# Conflict Resolution

Use this when multiple instructions appear valid but point to different
solutions.

## Priority model

Resolve conflicts in this order:

1. **Safety/security and verified framework constraints.** Never violate a hard
   security boundary or installed API contract to satisfy a design preference.
2. **Explicit user requirement.** The user's requested product and behavior
   outrank optional profile conventions.
3. **Existing project contract.** Preserve established architecture and design
   unless the requested change requires altering them.
4. **Canonical Ludicord hard rules.** File conventions, generated-file rules,
   server/client boundaries, and framework ownership remain enforced.
5. **Primary product profile.** It controls the overall experience shape.
6. **Capability guidance.** It controls implementation of a selected need.
7. **Secondary product profile.** It applies only to the surface that actually
   needs it.
8. **Polish guidance.** Animation, visual flair, optional abstractions, and
   convenience patterns never override the above.

## Examples

### Game + admin surface

Game-first UI governs the play surface. Dashboard guidance governs the admin
surface. Do not turn the entire game into tables/cards because an admin page
exists.

### Collaborative utility + realtime

The collaborative profile defines how people work together; realtime guidance
defines synchronization. Realtime guidance must not inject game rounds,
matchmaking, scoring, or win/loss.

### User asks for a simple site but an old template has a dashboard shell

The explicit user request and current feature scope outrank the template's
accidental visual structure. Remove or ignore unrelated shell concepts only if
the requested redesign actually requires it; otherwise preserve existing work.

## When a conflict cannot be resolved

Do not average two incompatible requirements. State the concrete conflict and
choose the safest smallest interpretation when possible. Ask the user only if
both interpretations are materially different and repository evidence does not
resolve the intent.
