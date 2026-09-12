# Ludicord Agent Intelligence References

These references make the canonical Ludicord skill context-aware without
creating additional discoverable `SKILL.md` files.

Read them progressively:

1. [`skill-router.md`](skill-router.md) for every non-trivial product change.
2. [`project-analysis.md`](project-analysis.md) before changing an existing app.
3. [`capability-routing.md`](capability-routing.md) to select realtime,
   persistence, Discord context, auth, server routes, and other capabilities.
4. [`source-authority.md`](source-authority.md) when framework facts, versions,
   or docs disagree.
5. [`conflict-resolution.md`](conflict-resolution.md) when two policies pull
   the implementation in different directions.
6. [`scope-control.md`](scope-control.md) before expanding a request.
7. [`implementation-contract.md`](implementation-contract.md) before coding a
   non-trivial change.
8. [`validation-gates.md`](validation-gates.md) before reporting completion.

These documents do not redefine Ludicord APIs. Exact API signatures still come
from the installed package declarations and generated route declarations.
