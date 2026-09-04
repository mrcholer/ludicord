# Getting Started

> Documentation for Ludicord 2.2.4. See [release status](../releases/README.md).


Create an Activity and start the development server:

```bash
pnpm create ludicord-app my-activity
cd my-activity
pnpm dev
```

Add `LUDICORD_DISCORD_CLIENT_ID`, `LUDICORD_DISCORD_CLIENT_SECRET`, and a random `LUDICORD_SESSION_SECRET` of at least 32 characters to `.env.local`. Configure an HTTPS tunnel and Discord Activity URL Mapping before testing inside Discord.

The generated `app/pages.tsx` mounts one `LudicordActivity` and one `EmbedOutlet`. Files named `app/embeds/**/embed.tsx` become internal Activity screens; they do not change the browser URL. Files under `app/api` and `app/ws` become real server endpoints.

Useful commands:

```bash
pnpm dev
pnpm routes
pnpm doctor
pnpm build
pnpm start
```

For a local browser-only prototype, set `activity.outsideDiscord` to `allow` and `discord.auth.required` to `false`. Features that require the Discord SDK will remain unavailable outside Discord.
