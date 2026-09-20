<p align="center">
  <a href="https://github.com/mrcholer/ludicord"><img src="https://raw.githubusercontent.com/mrcholer/ludicord/main/.github/assets/ludicord-logo.png" alt="Ludicord" width="220" /></a>
</p>

<h1 align="center">create-ludicord-app</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/create-ludicord-app"><img alt="npm version" src="https://img.shields.io/npm/v/create-ludicord-app?style=flat-square&color=5865F2" /></a>
  <a href="https://www.npmjs.com/package/create-ludicord-app"><img alt="npm downloads" src="https://img.shields.io/npm/dm/create-ludicord-app?style=flat-square&color=00B0F4" /></a>
  <img alt="Tailwind CSS optional" src="https://img.shields.io/badge/Tailwind-optional-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Node.js 20.19 or newer" src="https://img.shields.io/badge/node-%3E%3D20.19-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
</p>

Create a complete Ludicord Discord Activity project.

Version 4.0 generates a unified file-system router starter with `app/page.tsx`, discovered embeds, HTTP `route.ts` and WebSocket `socket.ts` files, plus project-root imports.

```bash
npx create-ludicord-app my-activity
npx create-ludicord-app my-activity --tailwind
npx create-ludicord-app my-activity --no-tailwind
npx create-ludicord-app my-activity --package-manager pnpm --no-install
```

The interactive generator asks whether to include Tailwind CSS. Scripts can use `--tailwind` or `--no-tailwind`; non-interactive runs retain Tailwind by default for compatibility. Both starters include a polished responsive interface.

The generator creates a focused starter: `app/page.tsx`, `app/globals.css`, automatic minimize and auth UI, Home and Me embeds, an authenticated API route, and an audience WebSocket example. Its responsive Activity canvas includes active embed navigation, runtime topology, instance/global/channel presence, API health, practical extension points, and a Discord identity view in both Tailwind and plain CSS. V4 also configures `@/*` as a project-root TypeScript and compiler alias, then defines explicit `@/components`, `@/lib`, and root `@` compiler mappings so generated code avoids fragile directory traversal. Independent pathname pages can be added when project scale or a specific URL/shell requirement justifies them. Framework defaults handle optional generic loading, error, metadata, layout, and not-found conventions until an app chooses to add them. The starter also includes strict TypeScript and React configuration, environment templates with configurable local Discord identities, mobile safe-area CSS, graceful shutdown settings, application-specific Discord Activity origin protection, and safe API/WebSocket defaults. It refuses to overwrite a non-empty target directory.

Read the [documentation](https://github.com/mrcholer/ludicord/blob/main/docs/README.md), [release history](https://github.com/mrcholer/ludicord/blob/main/CHANGELOG.md), or [report an issue](https://github.com/mrcholer/ludicord/issues). The public repository contains documentation, package metadata and approved release distributions, not the original TypeScript implementation.

## Version-matched AI guidance

Ludicord 4 includes offline docs at `node_modules/ludicord/dist/docs/`, the
canonical skill at `node_modules/ludicord/dist/skills/ludicord/SKILL.md`, and
`node_modules/ludicord/AGENTS.md`. The short agent entry point sits at the package root, like Next.js, and points to the detailed resources under `dist/`.
Point your existing project agent instructions at `node_modules/ludicord/AGENTS.md` when needed.

Use one root and ordinary embeds by default. Prefix routing is optional for
large projects with independent surfaces or a concrete need for separate
pathname entry points, shells, or provider lifetimes.
