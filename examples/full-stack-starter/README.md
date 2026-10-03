# Ludicord full-stack starter

A complete Discord Activity that demonstrates Ludicord's React shell,
authenticated HTTP routes, WebSockets, participant data, typed embed
navigation, automatic auth screens, minimized UI, and production build.

[Documentation](https://github.com/mrcholer/ludicord/blob/main/docs/README.md) | [Releases](https://github.com/mrcholer/ludicord/blob/main/CHANGELOG.md) | [Support](https://github.com/mrcholer/ludicord/issues)

## Start

1. Copy .env.example to .env.local and fill in your Discord credentials (use a random Session Secret of at least 32 characters).
2. Configure your Discord Activity URL Mapping.
3. Run npm run dev.

Styling: Plain CSS is enabled; Tailwind dependencies are not installed.

## App directory

- app/page.tsx owns the persistent Activity shell.
- app/globals.css contains global and mobile safe-area styles.
- app/auth/* provides automatic Discord sign-in states.
- app/home/embed.tsx is the live starter dashboard.
- app/me/embed.tsx reads the authenticated Discord profile.
- app/api/hello/route.ts demonstrates a protected server endpoint.
- app/ws/audience/socket.ts demonstrates realtime global, Home, and channel counts.
- app/minimize.tsx is shown automatically when Discord minimizes the Activity.

Ludicord automatically connects minimize.tsx and app/auth/*. The framework supplies built-in fallbacks for omitted optional convention files.
Embeds use a default React component from embed.tsx. Tailwind is detected automatically; no Vite config is needed.
API and WebSocket edits are hot-updated without restarting the dev server.
The starter API greets the authenticated Discord user. Its audience WebSocket counts unique connected users globally, on the Home embed, and in the current Discord channel. Replace its process-local Map with shared storage before scaling to multiple server processes.
Full guild member lists require optional server-side Discord permissions; useParticipants lists Activity participants.

## Production

```bash
npm run build
npm run start
```
