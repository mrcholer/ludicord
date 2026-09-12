# Migrating to Ludicord V4

> Migration guide for Ludicord 4.0.0. Confirm package availability from npm before changing production dependencies.

V4 preserves the V3 root `app/pages.tsx` and `app/embeds/` model. Existing single-scope Activities can remain structurally unchanged. Migration is required only when adopting recursive prefixes or replacing deep relative imports with the new project-root alias.

## Before upgrading

1. Keep the last deployable V3 build and lockfile.
2. Confirm the npm registry version before changing production dependencies.
3. Run the existing Activity with `ludicord routes`, `ludicord lint`, and `ludicord build`.
4. Record current embed deep links and Discord URL mappings.
5. Test V4 in a branch or local linked application before changing deployment configuration.

## Existing V3 application

This remains valid in V4:

```text
app/
├── pages.tsx
└── embeds/
    ├── home/embed.tsx
    └── game/embed.tsx
```

The URLs remain `/#/home` and `/#/game`. No prefix directory is required.

## Introduce one prefix at a time

Move only a coherent product surface. For example, migrate documentation embeds into `/docs`:

```text
app/
├── pages.tsx
├── embeds/home/embed.tsx
└── prefix/
    └── docs/
        ├── pages.tsx
        └── embeds/
            ├── start/embed.tsx
            └── api/embed.tsx
```

Add direct prefix navigation with `PrefixLink`. Keep `useEmbedRouter()` for movement between `start` and `api` after `/docs` is active.

## Replace deep relative imports

Generated V4 applications configure `@/` for the project root:

```diff
- import { Sidebar } from "../../../../../components/sidebar";
+ import { Sidebar } from "@/components/sidebar";
```

For an existing project, add `imports.aliases` to `ludicord.config.mjs`, then add matching `baseUrl` and `paths` entries to `tsconfig.json`. The V4 client and server compilers consume the Ludicord map while TypeScript consumes `paths`; keeping them aligned prevents editor and runtime behavior from diverging.

## Verify every scope

For each prefix:

- open its pathname directly;
- open its default `/#/` URL;
- open each explicit embed hash;
- use browser back and forward inside the scope;
- navigate to another prefix and verify the expected remount;
- test browser preview and the Discord Activity frame;
- confirm unknown prefixes return 404 in production.

## Deployment and Discord mapping

All prefix paths are served by the same Ludicord Node runtime. Configure the reverse proxy to forward them to that runtime. If Discord URL Mappings are used for these paths, create the necessary mappings without replacing the OAuth redirect expected by Discord's Activity flow.

## Rollback

Rollback means restoring the previous package version, lockfile, application tree, URL mappings, and last valid production output together. Do not leave external links pointing at prefix paths after deploying a V3 build that cannot serve them.

See the [V4 Prefix Router](prefix-router.md), [development runtime](development.md), [build guide](build.md), and [troubleshooting](troubleshooting.md) before production adoption.
