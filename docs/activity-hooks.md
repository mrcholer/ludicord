# Activity hooks and shared state

Ludicord keeps ordinary React state ordinary: use React's `useState`, `useReducer`, `useMemo`, and `useEffect` for component-local behavior. The Activity hooks solve Discord-specific lifecycle, persistence, data fetching, presence, frames, events, and instance synchronization.

Import them from `ludicord/activity` or from the root `ludicord` entry point.

## Lifecycle

`useActivityLifecycle()` combines browser and framework readiness without adding event listeners in every component:

```tsx
const lifecycle = useActivityLifecycle();

if (!lifecycle.online) return <Offline />;
if (!lifecycle.discordReady) return <Connecting />;
```

It returns `visibility`, `visible`, `focused`, `online`, `discordStatus`, `discordReady`, and `websocketReady`. `websocketReady` means at least one Ludicord WebSocket is currently open; it does not promise that a specific route is connected.

## Scoped storage

`useActivityStorage(key, initialValue, options)` persists JSON values in local storage and synchronizes browser tabs:

```tsx
const sound = useActivityStorage("sound", true, { scope: "user" });

<button onClick={() => sound.setValue((enabled) => !enabled)}>
  Sound: {sound.value ? "on" : "off"}
</button>
```

Scopes are `activity` (default), `application`, `instance`, `user`, `guild`, and `channel`. The default `activity` scope is shared by the current browser for backward compatibility. `application` separates different Discord applications, while `instance` separates simultaneous launches of the same Activity. Identity scopes become available only after Discord supplies the required identity; check `available` when the distinction matters. `remove()` deletes the stored value and restores the initial value. Supply `serialize`, `deserialize`, or a custom `Storage` for non-JSON needs. Storage is a client convenience, never a trusted authorization source.

## Cached Activity queries

`useActivityQuery` deduplicates concurrent requests with the same key, caches results, retries bounded failures, and aborts timed-out or replaced work:

```tsx
const leaderboard = useActivityQuery(
  ["leaderboard", guildId],
  ({ signal }) => fetch(`/api/leaderboard/${guildId}`, { signal })
    .then((response) => {
      if (!response.ok) throw new Error("Leaderboard failed");
      return response.json() as Promise<Leaderboard>;
    }),
  { staleTime: 15_000, retries: 2, timeout: 8_000 },
);
```

The result provides `data`, `status`, `error`, `updatedAt`, `refetch()`, and optimistic `mutate()`. Keys must be non-empty strings or JSON-serializable arrays. `clearActivityQueryCache()` clears all entries; pass a key to clear one. The cache is in browser memory and is not a replacement for server caching.

## Presence

`useActivityPresence()` groups the values usually needed by a multiplayer surface: `participants`, `participantCount`, `currentParticipant`, `voiceStates`, `speakingUserIds`, and `alone`. It updates from Ludicord's shared Discord event store.

Use `useDiscordEvent(name, callback, { replayLatest })` from `ludicord/discord` when behavior—not rendering—must respond to an untouched SDK payload:

```tsx
useDiscordEvent("ORIENTATION_UPDATE", (payload) => {
  analytics.record("orientation", payload);
}, { replayLatest: true });
```

The listener is cleaned up automatically and always calls the latest callback. Prefer render hooks such as `useOrientation()` when the value directly controls JSX.

## Game loop

`useGameLoop(callback, options)` owns one `requestAnimationFrame` loop and prevents giant simulation jumps after a hidden tab resumes:

```tsx
const loop = useGameLoop(({ delta }) => game.step(delta), {
  pauseWhenHidden: true,
  maxDelta: 50,
});
```

It returns `running`, `start()`, and `stop()`. Keep visual state in refs or an external game model when it changes every frame; rendering React state 60 times per second is normally unnecessary.

## Shared Activity state

`useSharedActivityState(route, key, initialValue)` synchronizes a small JSON value with other participants in the same verified Activity instance. It returns `value`, `revision`, `synchronized`, WebSocket `status`, and `setValue`.

The client helper must use a route implemented with `defineSharedActivityState()` from `ludicord/ws`. Server revisions resolve simultaneous writes and send the authoritative value back when a client is stale. Rapid local writes are serialized behind one in-flight revision, the newest queued value is retained, and reconnects read the server snapshot before resending local work. This is ideal for lobby readiness, round metadata, votes, and small presence-adjacent values. It is not intended for high-frequency physics, large documents, secrets, or durable saves.

The built-in store is bounded and process-local. In a multi-process deployment, pass a `LudicordSharedStateStore` with atomic `create` and `compareAndSet` operations:

```ts
export default defineSharedActivityState({
  initialState: { round: 1 },
  store: sharedStateStore,
});
```

Pair it with a `LudicordWebSocketAdapter` so state notifications and room membership cross process boundaries. Durable saves still belong in a database.

## Choosing the right state

| Need | Use |
| --- | --- |
| Temporary state in one component | React `useState` / `useReducer` |
| Persisted browser preference | `useActivityStorage` |
| Cached API result | `useActivityQuery` |
| Discord participants or voice summary | `useActivityPresence` |
| Raw SDK side effect | `useDiscordEvent` |
| Animation or simulation ticks | `useGameLoop` |
| Small value shared inside one Activity instance | `useSharedActivityState` |
| Durable or cross-server data | Database plus API/WS route |

All hooks follow the Rules of Hooks. Run `ludicord lint` before release, and keep React Strict Mode enabled so missing cleanup appears during development.
