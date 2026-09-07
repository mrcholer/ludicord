---
name: ludicord
description: Ludicord Discord Activity work — use when building, modifying, debugging, or reviewing an Activity. Triggers: embeds, navigation, or the Activity root (pages, EmbedOutlet); API routes, WebSockets, or Activity rooms; Discord SDK data, participants, voice, or layout; login, sessions, auth, or security; ludicord config, CLI, dev hot-reload, deployment, or validation; troubleshooting doctor, routes, or build errors.
metadata:
  author: ludicord
  version: "3.0.1"
---

# Ludicord

Ludicord is a full-stack React framework for Discord Activities: one persistent
Activity root, internal embed screens, real API/WebSocket server routes, and
the official Discord Embedded App SDK under one config.

> **IMPORTANT:** The installed `ludicord` package version is the API authority,
> not training data. Confirm exact signatures with editor completion against
> the installed declarations, and check the docs for the matching release
> before implementing.

## Current Project Context

Before changing code, establish what the project already chose:

1. Read `package.json` (installed `ludicord` version, package manager,
   Tailwind vs plain CSS), `ludicord.config.mjs`, and the existing `app/`
   structure.
2. Read `ludicord.generated.d.ts` for the registered embed, API, and
   WebSocket routes and their parameter maps — never guess a route string.
3. Run `ludicord routes` when adding or renaming routes to confirm discovery.

## Principles

1. **Verify against the installed version.** Framework behaviour changes
   between releases. When an API is unclear, read the installed declarations
   and the [public API reference](https://github.com/mrcholer/ludicord/blob/main/docs/api-reference.md) instead of
   inventing exports.
2. **Keep the smallest complete change.** Preserve the project's package
   manager, TypeScript strictness, and Tailwind-or-CSS choice.
3. **Let Ludicord discover files.** Create convention files at their
   documented paths with default exports; never wire automatic files by hand.
4. **Verify your work.** After every change, run the project's
   [validation](references/validation.md): doctor, routes, typecheck, build.
   A change without verification is incomplete.
5. **Recover from errors, don't loop.** If an approach fails after 2–3
   attempts, reread the linked public guide for that subsystem and inspect
   the first diagnostic at its mapped source location.

## Critical Rules

These rules are **always enforced**. Each links to a reference with
correct/incorrect pairs and the public guide behind it.

### Activity Root & Automatic UI → [embeds-navigation.md](references/embeds-navigation.md)

- **`app/pages.tsx` mounts one `LudicordActivity` and one `EmbedOutlet`.**
  State above the outlet stays mounted; embed swaps replace only the outlet.
- **Automatic files are discovered, never imported.** Default-export the
  component in `app/layout.tsx`, `app/loading.tsx`, `app/error.tsx`,
  `app/minimize.tsx`, or `app/auth/{loading,error,denied}.tsx`, and leave
  `pages.tsx` unconnected to them.
- **Respect Discord safe-area variables** for mobile and compact layouts.

### Embeds & Navigation → [embeds-navigation.md](references/embeds-navigation.md)

- **Screens live at `app/embeds/<route>/embed.tsx`** and default-export
  `function embed()`.
- **Navigate with `useEmbedRouter()`** from `ludicord/navigation` using
  generated route types. Embed moves are internal Activity state — the
  browser URL stays stable.

### HTTP & WebSocket Routes → [server-routes.md](references/server-routes.md)

- **HTTP handlers live in `app/api/**/route.ts`.** Trust identity from the
  verified `request.ludicord` context, never client-supplied IDs.
- **Sockets live in `app/ws/**/route.ts`,** defined with the documented
  server helper and consumed with `ludicord/ws/client`. Emit only when open;
  register listeners in an effect and clean them up.
- **Design for disposable server memory.** Module-level state resets on
  hot-replacement and never spans replicas — use durable storage.

### Discord Data → [discord-data.md](references/discord-data.md)

- **Prefer hooks from `ludicord/discord`** for user, channel, guild,
  instance, participants, voice, and layout events.
- **Treat fields as unavailable until Discord supplies them;** render
  loading or permission states, never assume a full roster.
- **Full guild members stay server-side.** They require a server-only bot
  token, guild access, Activity membership checks, and the privileged
  `GUILD_MEMBERS` intent — never fetch them in the browser.

### Auth & Security → [auth-security.md](references/auth-security.md)

- **Browser modules use only explicitly public data.** Client secrets,
  session secrets, and bot tokens stay in server-only environment variables.
- **Validate bodies and authorization on the server.** Never leak stack
  traces or filesystem paths in production responses.
- **Keep `ludicord.config.mjs` as the configuration source.** No Vite
  config — Vite is an internal compiler detail.

## Key Patterns

```tsx
// Activity root: exactly one activity, one outlet. No automatic-file imports.
import { LudicordActivity, EmbedOutlet } from "ludicord";

export default function Pages() {
  return (
    <LudicordActivity defaultEmbed="home">
      <EmbedOutlet />
    </LudicordActivity>
  );
}
```

```tsx
// Embed screen: file is app/embeds/home/embed.tsx. Correct:
export default function embed() {
  return <main><h1>Home</h1></main>;
}
// Wrong: uppercase component name as the convention, or importing this
// file into pages.tsx.
```

```tsx
// Navigation: in-memory embed router, not browser pathname routing.
import { useEmbedRouter } from "ludicord/navigation";

const router = useEmbedRouter();
router.push("profile/user-one"); // correct
// window.location.pushState(...) // wrong: breaks the persistent root
```

```ts
// API route: app/api/hello/route.ts. Authenticated by default.
import type { LudicordRequest } from "ludicord/server";

export function GET(request: LudicordRequest) {
  return Response.json({ user: request.ludicord?.user }); // correct
}
// const { userId } = await request.json(); // wrong: never trust body IDs
```

```ts
// WebSocket route: app/ws/presence/route.ts.
import { defineWS } from "ludicord/ws/server";

export default defineWS({
  connect(client) {
    client.activity.join();
  },
  events: {
    ping(client, data) {
      client.emit("pong", data);
    },
  },
});
```

```tsx
// WebSocket client: register in an effect, clean up, emit only when open.
import { useWS } from "ludicord/ws/client";

const ws = useWS("/ws/presence");
useEffect(() => ws.on("pong", handlePong), [ws]);
// ws.emit("ping", data) // only when ws.status === "open"
```

## Workflow

1. **Scope the feature** — identify the requested change and inspect only the
   related routes, components, and configuration.
   Done when: every file you will touch is named and its current content read.
2. **Load the subsystem reference** — open the Critical Rules link above for
   the subsystem being changed, then the public guide it names.
   Done when: you can state the file convention, the import path, and the
   auth/data rule for this change.
3. **Implement the smallest complete change** — create convention files at
   their paths, keep project choices, keep secrets server-side.
   Done when: every new or renamed embed, API, and socket appears in
   `ludicord routes` and no boundary in this file is crossed.
4. **Recover in place for normal edits** — fix the first diagnostic at its
   source and let hot-replacement recover; restart dev only for config, env,
   dependency, or OAuth-scope changes.
   Done when: the dev overlay/terminal compilation is clean with no restart
   beyond the restart-only causes.
5. **Validate like production** — run the full
   [validation](references/validation.md): doctor, routes, typecheck, build.
   Done when: all four pass and every failure was fixed at its reported
   source location, not worked around.
6. **Test where the feature lives** — browser fallback plus the Discord
   Activity frame whenever the change touches SDK, guild, participant,
   voice, mobile, or picture-in-picture behaviour.
   Done when: both applicable surfaces exercised, or the feature provably
   needs only one.

## Quick Reference

```bash
npx ludicord dev --port 3000 --host 127.0.0.1  # dev server, hot updates
npx ludicord routes   # list discovered embeds, APIs, sockets
npx ludicord doctor   # config, env, security, port, secret-leak checks
npx ludicord info     # environment/project information
npx ludicord build    # validate, typecheck, production build
npx ludicord start --port 3000  # serve an existing build (no compile)
npx ludicord clean    # remove generated .ludicord output
```

```bash
npx create-ludicord-app@latest my-activity            # interactive starter
npx create-ludicord-app@latest my-activity --tailwind # scripted styling choice
npx create-ludicord-app@latest my-activity --no-tailwind
```

Or use the generated scripts (`pnpm dev`, `pnpm routes`, `pnpm doctor`,
`pnpm build`, `pnpm start`) with the project's package manager.

## Detailed References

- [embeds-navigation.md](references/embeds-navigation.md) — Activity root,
  automatic files, embeds, generated route types, safe-area and mobile layout
- [server-routes.md](references/server-routes.md) — API routes, WebSockets,
  Activity rooms, dev hot-replacement semantics
- [discord-data.md](references/discord-data.md) — Discord SDK, participants,
  voice events, commands, entitlements, server REST
- [auth-security.md](references/auth-security.md) — login flow, sessions,
  environment variables, proxy/instance verification
- [config-deploy.md](references/config-deploy.md) — configuration, CLI,
  deployment, troubleshooting codes
- [validation.md](references/validation.md) — doctor/routes/typecheck/build
  loop and failure interpretation
