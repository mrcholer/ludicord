# Ludicord framework rules

## Activity root and automatic UI

- `app/pages.tsx` renders exactly one `LudicordActivity` and one `EmbedOutlet`.
- `app/layout.tsx`, `app/loading.tsx`, `app/error.tsx`, `app/minimize.tsx` and `app/auth/{loading,error,denied}.tsx` are discovered automatically. Default-export the component; do not import these files into `pages.tsx`.
- Keep global CSS imported by the Activity root. Respect Discord safe-area variables for mobile and compact layouts.

Read [pages](../../../docs/pages.md), [mobile layout](../../../docs/mobile-layout.md) and [login](../../../docs/login.md).

## Embeds and navigation

- Put screens at `app/embeds/<route>/embed.tsx`.
- Default-export a lowercase named component: `export default function embed()`.
- Navigate with `useEmbedRouter()` from `ludicord/navigation`; use generated route types when available.
- Embed changes are internal Activity state and do not rewrite the browser URL.

Read [embeds](../../../docs/embeds.md) and [navigation](../../../docs/navigation.md).

## HTTP and WebSocket routes

- Put HTTP handlers in `app/api/**/route.ts`. Authentication is expected by default; use verified `request.ludicord` context instead of trusting client-supplied identity or guild IDs.
- Put sockets in `app/ws/**/route.ts`, define them with the documented server helper, and consume them with `ludicord/ws/client`.
- Normal route and shared server-module edits hot-replace after successful compilation. A failed replacement keeps the previous working route and reports the source error.
- Module-level memory resets on replacement and does not span replicas. Use durable storage for persistent or multi-instance state.

Read [API routes](../../../docs/api-routes.md), [WebSockets](../../../docs/websockets.md) and [Activity rooms](../../../docs/activity-rooms.md).

## Discord data

- Prefer hooks from `ludicord/discord` for the user, channel, guild, Activity instance, participants, voice and layout events.
- Treat fields as unavailable until Discord supplies them; render useful loading or permission states.
- Activity participants are not the full guild roster. Full members require a server-only bot token, guild access, Activity membership checks and the privileged `GUILD_MEMBERS` intent.
- OAuth scope changes require renewed authorization and usually a development restart.

Read [Discord SDK](../../../docs/discord-sdk.md), [participants](../../../docs/participants.md) and [voice events](../../../docs/voice-events.md).

## Security and production

- Browser modules may use only explicitly public environment data. Client secrets, session secrets and bot credentials stay server-side.
- Validate request bodies and authorization on the server. Do not leak stack traces or filesystem paths in production responses.
- Keep `ludicord.config.mjs` as the configuration source. Do not create a Vite config.

Read [security](../../../docs/security.md), [configuration](../../../docs/configuration.md) and [deployment](../../../docs/deployment.md).
