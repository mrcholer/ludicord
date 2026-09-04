---
name: ludicord
description: Build, modify, debug, or review Ludicord Discord Activity projects while preserving the framework's pages, embeds, automatic UI, HTTP API, WebSocket, Discord SDK, authentication, security, and deployment conventions.
---

# Ludicord

Use the installed package version as the authority for available APIs. Read the local `package.json`, `ludicord.config.mjs`, existing `app/` structure and generated route types before changing code.

## Work in this order

1. Identify the requested feature and inspect only the related routes, components and configuration.
2. Read [framework rules](references/framework-rules.md). Open the linked public guide for the subsystem being changed.
3. Preserve existing project choices such as package manager, TypeScript strictness and Tailwind or plain CSS.
4. Implement the smallest complete change. Let Ludicord discover convention files instead of manually connecting them.
5. Follow [validation](references/validation.md) and fix the first actionable error at its reported source location.

## Non-negotiable boundaries

- Keep secrets, Discord client secrets, session secrets and bot tokens out of client modules and Git.
- Never edit `.ludicord/`, build output or `ludicord.generated.d.ts` by hand.
- Do not add `vite.config.*`; Vite is an internal compiler detail.
- Do not replace Ludicord routing with browser routing. Embed navigation intentionally keeps the browser URL stable.
- Do not fetch privileged guild member data in the browser. Full rosters require server-side bot access and the `GUILD_MEMBERS` intent.
- Do not restart the development server for normal API or WebSocket route edits; wait for a successful hot replacement. Restart only for configuration, environment, dependency or OAuth scope changes.

When an API is unclear, consult the installed `ludicord` declarations and the [public API reference](../../docs/api-reference.md). Do not invent framework exports.
