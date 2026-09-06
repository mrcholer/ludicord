# Usage recipes

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).

These small application examples illustrate the public API. They are not framework implementation or complete production applications.

## Show available channel information

In `app/embeds/home/embed.tsx`:

```tsx
import { useDiscordChannel } from "ludicord/discord";

export default function embed() {
  const channel = useDiscordChannel();
  return (
    <main>
      <h1>{channel?.name ?? "Channel unavailable"}</h1>
      <p>{channel?.kind ?? "Unknown type"}</p>
    </main>
  );
}
```

Handle missing context and denied permissions. See [Discord data](discord-sdk.md).

## Automatic compact view

Create `app/minimize.tsx`; do not import it into `pages.tsx`:

```tsx
export default function Minimized() {
  return <aside>Your Activity is still running.</aside>;
}
```

See [automatic files](pages.md) for layout, loading, error and auth conventions.

## Explicitly public health endpoint

In `app/api/health/route.ts`:

```ts
export const auth = false;

export function GET() {
  return Response.json({ ok: true });
}
```

Only opt out of authentication for intentionally public data. Never return server secrets or detailed infrastructure information from a public health endpoint.

## Authenticated WebSocket echo

In `app/ws/echo/route.ts`:

```ts
import { defineWS } from "ludicord/ws/server";

export default defineWS({
  events: {
    echo(client, data) {
      client.emit("echo", data);
    },
  },
});
```

In a React component, call `useWS("/ws/echo")`. Register `on("echo", listener)` inside an effect, return its cleanup function, and send only when `status === "open"`. The browser needs a valid Ludicord session. Validate application-specific payloads before using them.

See [API routes](api-routes.md), [WebSockets](websockets.md) and [rooms](activity-rooms.md) for more details.
