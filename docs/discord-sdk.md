# Discord SDK

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).


Ludicord uses the official `@discord/embedded-app-sdk` package and initializes one SDK instance per Activity. `LudicordActivity` waits for SDK readiness before authentication and reuses shared subscriptions rather than registering one listener per component.

```tsx
import {
  useActivityInstance,
  useDiscordChannel,
  useDiscordGuild,
  useDiscordUser,
} from "ludicord/discord";
```

Outside Discord, behavior is controlled by `activity.outsideDiscord`: `error`, `allow`, or `mock`. Allow mode makes browser development possible but does not fabricate Discord identity or voice capabilities.

Higher-level hooks capability-check optional commands and events. `useDiscordDiagnostics()` reports missing scopes in development. Ludicord does not connect to the Discord Gateway and does not run a bot client.

## Data and permissions

`useDiscordChannel()` returns ID plus available name, numeric type, `kind` (such as `voice`, `text`, or `stage`), `isVoice`, guild ID, and topic. `useDiscordGuild()` includes the guild name/icon from the authenticated user's guild list. Request `identify` and `guilds` in `ludicord.config.mjs`; restart/re-authorize after changing OAuth scopes. Group-DM channel details additionally require approved `dm_channels.read` access. [Discord Activity guide](https://docs.discord.com/developers/activities/building-an-activity)

The member APIs have distinct scopes:

- `useParticipants()`: users connected to this Activity, not every channel/guild member.
- `useChannelMembers()`: users included in the channel's SDK voice-state snapshot.
- `useCurrentGuildMember()`: current user's guild nickname/avatar updates.
- `useDiscordGuildMembers({ limit: 100, enabled: true })`: paginated full guild roster with `members`, `status`, `error`, `refresh()`, `loadMore()`, and `hasMore`. Requires server-only `LUDICORD_DISCORD_BOT_TOKEN`, bot access to the guild, and the `GUILD_MEMBERS` privileged intent. The server verifies the caller is a member of the Activity and derives the guild from Discord, not a browser-supplied guild ID. [List Guild Members](https://docs.discord.com/developers/resources/guild#list-guild-members)

With the bot token available at build/dev time, the framework also requests verified extended guild/channel context: guild description, features, approximate member count, and REST channel details where permitted. Missing permissions are reported through `useDiscordDiagnostics()`; a framework cannot bypass Discord approvals or infer unavailable data.

`useDiscordCommands()` exposes typed `supports(name)` and `call(name, ...args)` for the official SDK commands (excluding framework-owned login commands). This includes invites, sharing, channel permissions, Activity configuration, entitlements, and other client-supported commands. `useDiscordEntitlements()` tracks entitlement-create events; query the SDK's `getEntitlements` command for the initial list. [SDK reference](https://docs.discord.com/developers/developer-tools/embedded-app-sdk)

Server API/WS handlers can use `createDiscordRest()` from `ludicord/server` for guild/channel/member data. Check the session and Activity authorization before exposing any server REST result. Tokens never belong in client code.
