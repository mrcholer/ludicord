# Public API reference

> Documentation for Ludicord 2.2.5. See [release status](../releases/README.md).

This page describes supported import paths and their purpose. The package includes TypeScript declarations for exact signatures and data shapes; use editor completion against the version you actually installed.

## React and navigation

| Import path | APIs |
| --- | --- |
| `ludicord` | `LudicordActivity`, `EmbedOutlet`, `LudicordErrorBoundary`, `LudicordLoadingBoundary`, `Minimize`, `useLudicordMinimize`, `LudicordMinimizeProvider`, `LUDICORD_VERSION` |
| `ludicord/navigation` | `useEmbedRouter`, `useEmbedPath`, `useEmbedParams` and generated route/parameter types |
| `ludicord/runtime` | `useLudicordRuntime` for environment, version, Activity/Discord/WebSocket readiness and auth status |
| `ludicord/config` | `defineConfig` and configuration types |

The compiler supplies the minimize provider for automatic files; do not manually wrap it just to use `app/minimize.tsx`. See [automatic files](pages.md) and [navigation](navigation.md).

## Authentication

From `ludicord/auth`:

- `useLudicordAuth`, `useLudicordSession`, `useAuthStatus`, `useAuthError`.
- `authenticateLudicord` and `logoutLudicord` for explicit login/logout actions.
- Session, user and auth-status types.

The Activity owns normal initialization. Do not duplicate SDK login in page components. Client sessions expose safe context, not OAuth tokens. See [login](login.md).

## Discord

From `ludicord/discord`:

| Category | APIs |
| --- | --- |
| Readiness/context | `useDiscord`, `useActivityInstance`, `useDiscordDiagnostics` |
| Identity | `useDiscordUser`, `useDiscordGuild`, `useDiscordChannel`, `useDiscordLocale`, `channelTypeName` |
| People | `useParticipants`, `useChannelMembers`, `useCurrentGuildMember`, `useDiscordGuildMembers` |
| Voice | `useVoiceState`, `useParticipantVoiceState`, `useSpeakingUsers`, `useIsSpeaking` |
| Device/layout | `useActivityLayoutMode`, `useOrientation`, `useThermalState`, `useLudicordSafeArea` |
| Commands/commerce | `useDiscordCommands`, `useDiscordEntitlements` |

Low-level initialization helpers and safe-area helpers also have shipped declarations, but the Activity initializes the normal runtime automatically. Missing fields may indicate unavailable context or permissions, not an empty Discord guild. See [Discord SDK data and permissions](discord-sdk.md).

## HTTP and server-only APIs

From `ludicord/server`:

- `LudicordRequest`, `RouteContext`, `LudicordRequestVerification` types.
- `getLudicordSession` and `requireLudicordSession`.
- `createDiscordRest`, `LudicordDiscordRestError` and Discord REST guild/channel/member types.

API route handlers export HTTP method names and receive a native Request extended with route params and trusted session/verification context. See [API routes](api-routes.md).

`ludicord/security` contains server-side Discord verification helpers. `ludicord/runtime/server` contains server tooling. Neither belongs in browser components.

## WebSockets

Use `defineWS` from `ludicord/ws/server` to define route callbacks. Use `useWS` from `ludicord/ws/client` in React.

`useWS(route, options)` returns `status`, `emit`, `on`, `off`, `close` and `reconnect`. Status is `connecting`, `open`, `reconnecting`, `closed` or `error`. An `on` call returns an unsubscribe function. Register listeners in an effect and clean them up.

Connection options include `enabled` and reconnection limits. Emit only when open; messages are not buffered while disconnected. Use explicit client/server entry points instead of the mixed `ludicord/ws` barrel in browser code.

See [WebSockets](websockets.md) and [Activity rooms](activity-rooms.md).

## Testing and internal paths

`ludicord/testing` supplies testing utilities; keep these out of production application bundles. `ludicord/internal` is compiler-owned and is not an application integration API. Never import generated `.ludicord` files from application code.
