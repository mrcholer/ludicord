# Discord Data, Participants, Voice, and Layout Events

Read the [Discord SDK guide](https://github.com/mrcholer/ludicord/blob/main/docs/discord-sdk.md),
[participants](https://github.com/mrcholer/ludicord/blob/main/docs/participants.md), and
[voice events](https://github.com/mrcholer/ludicord/blob/main/docs/voice-events.md) for the full guides.

## Setup

Ludicord uses the official `@discord/embedded-app-sdk` package and keeps one
SDK instance per Activity. `LudicordActivity` waits for SDK readiness and
reuses shared subscriptions — components never register one listener each.

```tsx
// Correct: shared hooks from one import surface.
import {
  useActivityInstance,
  useDiscordChannel,
  useDiscordGuild,
  useDiscordUser,
} from "ludicord/discord";
```

- Request `identify` and `guilds` in `ludicord.config.mjs`. Restart and
  re-authorize after changing OAuth scopes.
- `useDiscordDiagnostics()` reports missing scopes in development — check it
  before assuming broken data.
- Outside Discord, `activity.outsideDiscord` controls behaviour: `error`,
  `allow`, or `mock`. Allow mode enables browser development but does not
  fabricate Discord identity or voice capabilities.
- Ludicord does not connect to the Discord Gateway and does not run a bot
  client.

## Hook catalogue

From `ludicord/discord`:

| Category | Hooks |
| --- | --- |
| Readiness/context | `useDiscord`, `useActivityInstance`, `useDiscordDiagnostics` |
| Identity | `useDiscordUser`, `useDiscordGuild`, `useDiscordChannel`, `useDiscordLocale`, `channelTypeName` |
| People | `useParticipants`, `useChannelMembers`, `useCurrentGuildMember`, `useDiscordGuildMembers` |
| Voice | `useVoiceState`, `useParticipantVoiceState`, `useSpeakingUsers`, `useIsSpeaking` |
| Device/layout | `useActivityLayoutMode`, `useOrientation`, `useThermalState`, `useLudicordSafeArea` |
| Commands/commerce | `useDiscordCommands`, `useDiscordEntitlements` |

```tsx
// Correct: treat fields as unavailable until Discord supplies them.
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

Missing fields signal unavailable context or permissions, not an empty
guild. Render useful loading or permission states.

## Channel and guild details

- `useDiscordChannel()` returns ID plus available name, numeric type, `kind`
  (`voice`, `text`, `stage`), `isVoice`, guild ID, and topic.
- `useDiscordGuild()` includes the guild name/icon from the authenticated
  user's guild list.
- Group-DM channel details additionally require approved `dm_channels.read`
  access.
- Higher-level hooks capability-check optional commands and events, so
  unsupported events never crash the Activity.

## Member APIs and their scopes

Each member hook answers a different question — pick the one that matches:

- `useParticipants()`: users connected to this Activity. SDK state backed by
  one shared store on `ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE` — not the full
  roster, and not proof of an authenticated server request.

```tsx
// Correct
import { useParticipants } from "ludicord/discord";

const participants = useParticipants();
```

- `useChannelMembers()`: users in the channel's SDK voice-state snapshot.
- `useCurrentGuildMember()`: current user's guild nickname/avatar updates.
- `useDiscordGuildMembers({ limit: 100, enabled: true })`: paginated full
  guild roster (`members`, `status`, `error`, `refresh()`, `loadMore()`,
  `hasMore`). Full rosters require all of: a server-only
  `LUDICORD_DISCORD_BOT_TOKEN`, bot access to the guild, the privileged
  `GUILD_MEMBERS` intent, server-side Activity membership checks, and a
  guild derived from Discord — never a browser-supplied guild ID.

```tsx
// Wrong: full roster lookup in the browser.
// const res = await fetch(`/api/members?guildId=${guildId}`); // never trust body IDs
```

With the bot token present at build/dev time, the framework also requests
verified extended guild/channel context (description, features, approximate
member count, REST channel details where permitted). A framework cannot
bypass Discord approvals or infer unavailable data.

## Voice

Request the `rpc.voice.read` scope, then:

```tsx
// Correct
import {
  useIsSpeaking,
  useParticipantVoiceState,
  useSpeakingUsers,
  useVoiceState,
} from "ludicord/discord";
```

- Shared subscriptions cover `VOICE_STATE_UPDATE`, `SPEAKING_START`, and
  `SPEAKING_STOP`.
- `useSpeakingUsers()` returns speaking user IDs; `useIsSpeaking(id)` suits
  indicators. `useVoiceState()` returns all known voice states;
  `useParticipantVoiceState(id)` selects one participant.
- Missing `rpc.voice.read` surfaces through `useDiscordDiagnostics()` in
  development. These hooks observe the Embedded App SDK only.

## Commands, entitlements, and server REST

- `useDiscordCommands()` exposes typed `supports(name)` and
  `call(name, ...args)` for official SDK commands (excluding
  framework-owned login commands): invites, sharing, channel permissions,
  Activity configuration, entitlements, and other client-supported commands.
- `useDiscordEntitlements()` tracks entitlement-create events; query the
  SDK's `getEntitlements` command for the initial list.
- Server API/WS handlers use `createDiscordRest()` from `ludicord/server`
  for guild/channel/member data. Check the session and Activity
  authorization before exposing any server REST result. Tokens never belong
  in client code.
