# React state and effects

> Documentation for Ludicord 3.1.0. See [release status](../releases/README.md).

Ludicord is React, so ordinary React state is the first choice for ordinary interface state. Framework hooks add Activity-aware lifecycles; they do not replace `useState`, `useReducer`, or correct effect cleanup.

## Choose state by lifetime

| Requirement | Recommended tool |
| --- | --- |
| Local input, menu, modal, selection, temporary game UI | `useState` |
| Related local state transitions | `useReducer` |
| Derived display value | Calculate during render; use `useMemo` only when useful |
| External subscription, timer, browser API, socket listener | `useEffect` with cleanup |
| State that survives embed navigation | State or context above `EmbedOutlet` |
| Browser persistence scoped to an Activity, user, guild, or channel | `useActivityStorage` |
| Managed async read with cache, retry, timeout, and cancellation | `useActivityQuery` |
| Participants and voice summary | `useActivityPresence` |
| Visibility/focus/online/Discord/socket readiness | `useActivityLifecycle` |
| Animation frames that pause when hidden | `useGameLoop` |
| Small synchronized value for one Activity instance | `useSharedActivityState` |
| Durable or authoritative multiplayer state | API/WS route plus application-owned storage |

## Local state

```tsx
import { useState } from "react";

export default function embed() {
  const [score, setScore] = useState(0);

  return (
    <button onClick={() => setScore((current) => current + 1)}>
      Score: {score}
    </button>
  );
}
```

State above `EmbedOutlet` remains mounted while Ludicord changes embed screens. State inside an embed belongs to that screen and may reset when it unmounts.

## Effects and WebSocket listeners

Effects synchronize React with something outside React. They should not be used merely to calculate one state value from another.

```tsx
import { useEffect, useState } from "react";
import { useWS } from "ludicord/ws/client";

export default function embed() {
  const socket = useWS("/ws/audience");
  const [watching, setWatching] = useState(0);

  useEffect(() => {
    return socket.on("audience", (payload) => {
      if (typeof payload === "object" && payload !== null && "global" in payload) {
        setWatching(Number(payload.global));
      }
    });
  }, [socket]);

  return <p>{watching} people watching</p>;
}
```

Return every unsubscribe function, clear timers, and abort stale requests. React Strict Mode replays development lifecycles to expose unsafe effects; fix missing cleanup instead of hiding it.

## Activity-scoped persistence

```tsx
import { useActivityStorage } from "ludicord/activity";

export default function embed() {
  const theme = useActivityStorage("theme", "dark", { scope: "user" });

  return <button onClick={() => theme.setValue("light")}>{theme.value}</button>;
}
```

Available scopes are `activity`, `user`, `guild`, and `channel`. The hook exposes `value`, `key`, `available`, `setValue`, and `remove`. This is browser storage, not a secure database: never store credentials or authoritative game state in it.

## Managed async reads

```tsx
import { useActivityQuery } from "ludicord/activity";

export default function Profile({ userId }: { userId: string }) {
  const profile = useActivityQuery(
    ["profile", userId],
    async ({ signal }) => {
      const response = await fetch(`/api/profile/${userId}`, { signal });
      if (!response.ok) throw new Error("Profile unavailable");
      return response.json() as Promise<{ displayName: string }>;
    },
    { staleTime: 30_000, retries: 1, timeout: 10_000 },
  );

  return <p>{profile.data?.displayName ?? profile.status}</p>;
}
```

The result includes `data`, `status`, `error`, `updatedAt`, `refetch()`, and `mutate()`. The API route must still authenticate and authorize the request; a client cache is not a security boundary.

## Shared Activity state

```tsx
import { useSharedActivityState } from "ludicord/activity";

export default function embed() {
  const ready = useSharedActivityState("/ws/game", "ready", false);
  return <button onClick={() => ready.setValue(true)}>{ready.value ? "Ready" : "Join"}</button>;
}
```

Shared Activity state is bounded, revision-checked, and isolated by the verified application and Activity instance. Use it for small collaborative values. Use durable application storage for large payloads, history, leader election, payments, or any state that must survive restarts and multiple replicas.

## Verify exact types

Hook signatures can change by release. Use editor completion from the installed package and check [`ludicord/activity`](api-reference.md) for the matching release. Typed embed, API, and WebSocket route strings come from `ludicord.generated.d.ts`; do not guess them or import generated `.ludicord/` files directly.
