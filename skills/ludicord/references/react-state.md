# React State, Effects, and Activity State

Read the public [React state and effects guide](https://github.com/mrcholer/ludicord/blob/main/docs/state-and-effects.md) for application examples.

Ludicord uses React normally. `useState`, `useReducer`, `useEffect`,
`useMemo`, `useCallback`, refs, context, and custom hooks remain available.
Choose state by lifetime instead of putting every value in a framework store.

## Choose the smallest lifetime

| Need | Use |
| --- | --- |
| Input, menu, modal, selected item | `useState` |
| Several related local transitions | `useReducer` |
| Value derived from props or hooks | Calculate during render; `useMemo` only when expensive or identity-sensitive |
| Subscribe to an external system | `useEffect` with cleanup |
| Survive embed navigation | State/context above `EmbedOutlet` |
| Persist by application, Activity instance, user, guild, or channel | `useActivityStorage()` from `ludicord/activity` |
| Managed async server read | `useActivityQuery()` from `ludicord/activity` |
| Discord participants and voice summary | `useActivityPresence()` from `ludicord/activity` |
| Animation frames with hidden-tab handling | `useGameLoop()` from `ludicord/activity` |
| Small value shared by one Activity instance | `useSharedActivityState()` from `ludicord/activity` |
| Authoritative or durable multiplayer data | API/WS route plus application-owned durable storage |

## Effects synchronize; they do not model ordinary UI

```tsx
import { useEffect, useState } from "react";
import { useWS } from "ludicord/ws/client";

export default function embed() {
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useWS("/ws/chat");

  useEffect(() => {
    return socket.on("message", (value: string) => {
      setMessages((current) => [...current, value]);
    });
  }, [socket]);

  return <p>{messages.length} messages</p>;
}
```

- Return unsubscribe/cleanup functions from effects.
- Use functional state updates when a callback depends on previous state.
- Never make the effect callback itself `async`; start async work inside it
  and abort or ignore stale work during cleanup.
- React Strict Mode intentionally replays development lifecycles. Fix missing
  cleanup instead of disabling Strict Mode to hide duplicate subscriptions.
- Do not copy a Ludicord hook result into `useState` merely to rename or
  filter it; derive the view value during render.

## Framework-owned Activity state

`useActivityStorage()` is browser persistence with `activity` (legacy
default), `application`, `instance`, `user`, `guild`, or `channel` scope. It
is not a server database and must not store secrets.

`useActivityQuery()` manages bounded client-side async reads, including
deduplication, stale times, retries, cancellation, refetch, and race safety.
Authentication and authorization still belong in the API route.

`useSharedActivityState()` is for compact, revision-checked values shared by
the current verified Activity instance. Its memory store is process-local.
For replicas, pair an atomic `LudicordSharedStateStore` with a
`LudicordWebSocketAdapter`. Use application-owned durable storage for
authoritative state, large payloads, history, or restart recovery.

Always verify exact hook options and return types against the declarations in
the installed package; do not infer signatures from this conceptual guide.
