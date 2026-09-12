---
name: ludicord
description: "Build, modify, debug, review, or document Ludicord Discord Activities. Use for Activity roots, embeds, typed navigation, React state and effects, API or WebSocket routes, shared Activity state, Discord SDK data, participants, voice, authentication, security, configuration, development diagnostics, deployment, migration, and release compatibility."
metadata:
  author: ludicord
  version: "3.1.1"
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
4. Treat `ludicord/internal` as compiler-owned. Never import it from Activity
   application code even when an older installed package exports it.

## Product and Skill Routing

Ludicord is the implementation framework, not the product design. Before a
non-trivial feature or architecture change, read
[`references/intelligence/skill-router.md`](references/intelligence/skill-router.md)
and classify the requested experience **before** selecting optional domain
guidance.

Hard routing rules:

- Realtime does not imply game.
- Multiple participants or shared state do not imply game.
- Calling `useGameLoop()` does not imply game.
- Do not load game-specific guidance unless gameplay is explicit or strongly
  evidenced by rules, goals, rounds, player actions, scoring, win/loss,
  simulation, or equivalent mechanics.
- Do not force dashboard/SaaS composition onto games, media experiences,
  focused utilities, or ordinary content apps.
- Preserve an existing project's product shape and design language unless the
  user asks to change them.
- Select realtime, persistence, Discord context, authority, API/WS, and other
  capabilities independently from product type.

The machine-readable routing index is [`manifest.yaml`](manifest.yaml), and the
layer map is [`knowledge-map.md`](knowledge-map.md).

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
   [validation](references/validation.md). Generated projects expose `dev`,
   `build`, and `start`; use documented advanced CLI commands directly when
   a task needs route inspection, linting, analysis, or environment details.
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
  generated route types. Ludicord synchronizes embeds with hash history so
  back/forward and deep links work while the Activity pathname stays stable.

### React State & Effects → [react-state.md](references/react-state.md)

- **Use React state for local UI.** Use an effect only to synchronize with an
  external system, and always clean up subscriptions, timers, and sockets.
- **Use the narrowest Ludicord primitive.** Choose Activity storage for
  scoped persistence, Activity query for managed async reads, and shared
  Activity state only for small values shared by the current instance.
- **Do not mirror hook results into state without a reason.** Derive values
  during render or with `useMemo`; duplicated state becomes stale.

### HTTP & WebSocket Routes → [server-routes.md](references/server-routes.md)

- **HTTP handlers live in `app/api/**/route.ts`.** Trust identity from the
  verified `request.ludicord` context, never client-supplied IDs.
- **Sockets live in `app/ws/**/route.ts`,** defined with the documented
  server helper and consumed with `ludicord/ws/client`. Emit only when open;
  register listeners in an effect and clean them up.
- **Design for disposable server memory.** Module-level state resets on
  hot-replacement. Use the documented shared adapters for replicas and a
  database for durable state.

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
- **Keep launch isolation framework-owned.** Same-origin fetches and Ludicord
  sockets carry the current launch automatically; never invent or accept a
  launch, application, instance, guild, channel, or user ID from the client.
- **Set production host/origin boundaries deliberately.** HTTP and WebSocket
  routes share `server.allowedHosts` and `server.allowedOrigins`.
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
// Navigation: typed hash history while the Activity pathname stays stable.
import { useEmbedRouter } from "ludicord/navigation";

const router = useEmbedRouter();
router.push("profile/user-one"); // correct
// window.location.href = "/profile/user-one" // wrong: bypasses the embed router
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

1. **Classify the experience** — for non-trivial work, use the skill router to identify the primary product profile and derive capabilities independently.
   Done when: you can state what the product is, what it is not, and why each selected capability is required.
2. **Scope and inspect the feature** — identify the requested change and inspect only the related routes, components, configuration, and existing product conventions.
   Done when: every file you will touch is named, its current content is read, and unrelated architecture is explicitly out of scope.
3. **Load only routed references** — open the selected product/capability references plus the Critical Rules reference for each Ludicord subsystem being changed.
   Done when: you can state the product constraints, file convention, import path, and auth/data rule for this change.
4. **Write an implementation contract for non-trivial work** — use [`implementation-contract.md`](references/intelligence/implementation-contract.md) to record state ownership, authority, files, validation, and non-goals before broad edits.
   Done when: every planned subsystem has a concrete reason.
5. **Implement the smallest complete change** — create convention files at
   their paths, keep project choices, keep secrets server-side.
   Done when: every new or renamed embed, API, and socket appears in
   `ludicord routes` and no boundary in this file is crossed.
6. **Recover in place for normal edits** — fix the first diagnostic at its
   source and let hot-replacement recover. Config and supported env changes
   perform a controlled restart; start a fresh command only after dependency
   or framework installation changes, and re-authorize after OAuth-scope changes.
   Done when: the dev overlay/terminal compilation is clean with no restart
   beyond the restart-only causes.
7. **Validate product + production** — run the applicable sequence in
   [validation](references/validation.md) plus [`validation-gates.md`](references/intelligence/validation-gates.md): first confirm the result still matches the requested product, then run route inspection for convention changes, React Hooks lint for hook changes, project typecheck when present, and a production build.
   Done when: every applicable check passes and each failure was fixed at its
   reported source location, not worked around.
8. **Test where the feature lives** — browser fallback plus the Discord
   Activity frame whenever the change touches SDK, guild, participant,
   voice, mobile, or picture-in-picture behaviour.
   Done when: both applicable surfaces exercised, or the feature provably
   needs only one.

## Quick Reference

```bash
npx ludicord dev --port 3000 --host 127.0.0.1  # dev server, hot updates
npx ludicord build    # validate, typecheck, production build
npx ludicord start --port 3000  # serve an existing build (no compile)
```

Advanced commands are available through the installed CLI; confirm flags
with `npx ludicord --help`:

```bash
npx ludicord routes   # list discovered embeds, APIs, sockets
npx ludicord lint     # validate React Hooks usage
npx ludicord analyze  # inspect a production bundle report
npx ludicord info     # environment/project information
npx ludicord clean    # remove generated .ludicord output
```

```bash
npx create-ludicord-app@latest my-activity            # interactive starter
npx create-ludicord-app@latest my-activity --tailwind # scripted styling choice
npx create-ludicord-app@latest my-activity --no-tailwind
```

Generated 3.1.1 projects intentionally include only `dev`, `build`, and
`start` scripts. Run advanced commands with the project's package runner.

## Routed Intelligence References

- [skill-router.md](references/intelligence/skill-router.md) — product classification, activation/exclusion rules, examples
- [project-analysis.md](references/intelligence/project-analysis.md) — inspect and preserve existing projects
- [capability-routing.md](references/intelligence/capability-routing.md) — select realtime, persistence, Discord context, authority, and server features independently
- [source-authority.md](references/intelligence/source-authority.md) — version/freshness/conflict hierarchy
- [conflict-resolution.md](references/intelligence/conflict-resolution.md) — priority rules when guidance disagrees
- [scope-control.md](references/intelligence/scope-control.md) — prevent overbuilding
- [implementation-contract.md](references/intelligence/implementation-contract.md) — pre-edit architecture contract
- [validation-gates.md](references/intelligence/validation-gates.md) — product fidelity + framework/security/build gates

Product profiles and optional game details are indexed in [manifest.yaml](manifest.yaml). Load only the profile selected by the router.

## Detailed References

- [embeds-navigation.md](references/embeds-navigation.md) — Activity root,
  automatic files, embeds, generated route types, safe-area and mobile layout
- [server-routes.md](references/server-routes.md) — API routes, WebSockets,
  Activity rooms, dev hot-replacement semantics
- [react-state.md](references/react-state.md) — React state/effects and
  Ludicord lifecycle, storage, query, presence, game-loop, and shared-state
  primitives
- [discord-data.md](references/discord-data.md) — Discord SDK, participants,
  voice events, commands, entitlements, server REST
- [auth-security.md](references/auth-security.md) — login flow, sessions,
  environment variables, proxy/instance verification
- [config-deploy.md](references/config-deploy.md) — configuration, CLI,
  deployment, troubleshooting codes
- [validation.md](references/validation.md) — routes/lint/typecheck/build
  loop and failure interpretation
