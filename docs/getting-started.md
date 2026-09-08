# Getting Started

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).


Create an Activity and start the development server:

```bash
pnpm create ludicord-app my-activity
cd my-activity
pnpm dev
```

The interactive creator asks whether to install Tailwind CSS. To make the choice in a script, run `npx create-ludicord-app@latest my-activity --tailwind` or `--no-tailwind`.

Add `LUDICORD_DISCORD_CLIENT_ID`, `LUDICORD_DISCORD_CLIENT_SECRET`, and a random `LUDICORD_SESSION_SECRET` of at least 32 characters to `.env.local`. Configure an HTTPS tunnel and Discord Activity URL Mapping before testing inside Discord.

The generated `app/pages.tsx` mounts one `LudicordActivity` and one `EmbedOutlet`. Files named `app/embeds/**/embed.tsx` become internal Activity screens. Typed navigation updates hash history for deep links and browser back/forward while keeping the Activity pathname and persistent root stable. Files under `app/api` and `app/ws` become real server endpoints.

Useful commands:

```bash
pnpm dev
pnpm build
pnpm start
```

Advanced commands stay available through the installed CLI even though they are not generated as package scripts:

```bash
pnpm exec ludicord routes
pnpm exec ludicord lint
pnpm exec ludicord info
```

For a local browser-only prototype, set `activity.outsideDiscord` to `allow` and `discord.auth.required` to `false`. Features that require the Discord SDK will remain unavailable outside Discord.
