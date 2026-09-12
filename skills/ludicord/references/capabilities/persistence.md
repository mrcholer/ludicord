# Persistence Capability

Choose persistence from lifetime, scope, sensitivity, and authority.

Read [`../react-state.md`](../react-state.md) for verified Ludicord state
primitives and their limits.

## Lifetime ladder

```text
render-local
→ survives component rerender
→ survives embed navigation
→ survives Activity relaunch
→ survives server process restart
→ survives replica changes
→ durable long-term application data
```

Pick the lowest layer that meets the requirement.

## Rules

- Local UI state stays React state.
- State that survives embed navigation can live above `EmbedOutlet` when that
  lifetime is sufficient.
- Framework Activity storage is not a secret store or server database.
- Shared Activity state is for compact instance-scoped values, not arbitrary
  authoritative history or large application state.
- Durable trusted state belongs in application-owned server storage.
- Do not persist transient state "just in case".
- Do not duplicate one source of truth across React state, framework storage,
  and server storage without a synchronization reason.
