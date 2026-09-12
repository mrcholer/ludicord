# V4 Prefix Router

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).

Ludicord V4 introduces recursive prefix routing. A prefix is a pathname-owned Activity scope with its own persistent `pages.tsx` root and its own local `embeds/` tree. Prefixes can contain more prefixes, allowing one Discord Activity deployment to expose several independently navigable surfaces without flattening every embed into one global route table.

## The mental model

Every prefix scope has two routing layers:

1. The browser pathname selects the scope, such as `/docs/api/v2`.
2. The hash selects an embed owned by that scope, such as `#/users`.

The complete URL is therefore:

```text
/<prefix path>/#/<local embed path>
```

The pathname chooses which `pages.tsx` shell remains mounted. The hash changes the active embed inside that shell. Navigating between embeds in one scope preserves that scope's providers and state. Navigating to another prefix mounts the other scope deliberately.

## Directory convention

The root Activity remains under `app/`. A child pathname segment is created under `prefix/<segment>/`. Recursion repeats the same convention:

```text
app/
├── pages.tsx
├── embeds/
│   └── home/
│       └── embed.tsx
└── prefix/
    ├── docs/
    │   ├── pages.tsx
    │   ├── embeds/
    │   │   └── start/
    │   │       └── embed.tsx
    │   └── prefix/
    │       ├── api/
    │       │   ├── pages.tsx
    │       │   ├── embeds/
    │       │   │   ├── home/embed.tsx
    │       │   │   └── auth/embed.tsx
    │       │   └── prefix/
    │       │       └── v2/
    │       │           ├── pages.tsx
    │       │           └── embeds/users/embed.tsx
    │       └── guides/
    │           ├── pages.tsx
    │           └── embeds/install/embed.tsx
    └── admin/
        ├── pages.tsx
        └── prefix/
            └── users/
                ├── pages.tsx
                └── embeds/list/embed.tsx
```

This tree produces:

| Source file | Activity URL |
| --- | --- |
| `app/embeds/home/embed.tsx` | `/#/` |
| `app/prefix/docs/embeds/start/embed.tsx` | `/docs/#/start` |
| `app/prefix/docs/prefix/api/embeds/home/embed.tsx` | `/docs/api/#/` |
| `app/prefix/docs/prefix/api/embeds/auth/embed.tsx` | `/docs/api/#/auth` |
| `app/prefix/docs/prefix/api/prefix/v2/embeds/users/embed.tsx` | `/docs/api/v2/#/users` |
| `app/prefix/docs/prefix/guides/embeds/install/embed.tsx` | `/docs/guides/#/install` |
| `app/prefix/admin/prefix/users/embeds/list/embed.tsx` | `/admin/users/#/list` |

The examples ending in `/#/` use the scope's `defaultEmbed`. The explicit embed name may also be used when a canonical link needs to name it.

## Define a prefix root

Every discovered prefix directory must contain `pages.tsx`. The file has the same contract as the root Activity: it initializes one `LudicordActivity` and exposes one `EmbedOutlet`.

```tsx
// app/prefix/docs/pages.tsx
import { EmbedOutlet, LudicordActivity } from "ludicord";
import { DocsNavigation } from "@/components/docs-navigation";

export default function Pages() {
  return (
    <LudicordActivity defaultEmbed="start">
      <DocsNavigation />
      <EmbedOutlet />
    </LudicordActivity>
  );
}
```

Providers above `EmbedOutlet` survive hash navigation inside `/docs`. A nested scope such as `/docs/api` has a different root and may use different providers, navigation, permissions, or visual shell.

Do not hide `LudicordActivity` or `EmbedOutlet` inside an unrelated wrapper. Keeping the boundary visible in `pages.tsx` lets the compiler validate each scope before runtime.

## Navigate between prefixes

Use `PrefixLink` for user-facing navigation between pathname scopes:

```tsx
import { PrefixLink } from "ludicord";

export function ProductNavigation() {
  return (
    <nav>
      <PrefixLink prefix="/" embed="home">Activity</PrefixLink>
      <PrefixLink prefix="/docs" embed="start">Docs</PrefixLink>
      <PrefixLink prefix="/docs/api" embed="auth">Authentication API</PrefixLink>
    </nav>
  );
}
```

Use `prefixHref()` when another component needs a URL string:

```tsx
import { prefixHref } from "ludicord";

const usersUrl = prefixHref("/docs/api/v2", "users");
// /docs/api/v2/#/users
```

Inside the current scope, continue using `Link` or `useEmbedRouter()` from `ludicord/navigation`. Those APIs accept local embed routes and update hash history without remounting the scope root.

## Read the active prefix

`useActivityPrefix()` returns the normalized pathname scope selected by the runtime:

```tsx
import { useActivityPrefix } from "ludicord";

export function ScopeBadge() {
  const prefix = useActivityPrefix();
  return <code>{prefix}</code>;
}
```

The root scope returns `/`. Nested scopes return values such as `/docs`, `/docs/api`, or `/admin/users`.

## Local route ownership

Embed names are local to their prefix. Both `/` and `/docs/api` may own an embed named `home`; the two modules do not conflict because their generated identities include the prefix.

`ludicord.generated.d.ts` includes:

- a union of discovered prefixes;
- an embed-route map for each prefix;
- the existing root-scope aliases for compatibility;
- generated dynamic parameter maps.

Use editor completion and generated declarations rather than manually duplicating these unions.

## Absolute project imports

V4 supports configurable aliases in client code and server route bundles. Generated projects include:

```js
// ludicord.config.mjs
export default defineConfig({
  imports: {
    aliases: {
      "@/components": "./components",
      "@/lib": "./lib",
      "@": ".",
    },
  },
});
```

The alias key is the import prefix and the value is a path relative to the project root. More specific keys are evaluated before broader keys. The examples above allow:

```tsx
import { AppShell } from "@/components/app-shell";
import { parseRoom } from "@/lib/rooms";
```

Generated projects include matching TypeScript configuration:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

When changing an alias, update `ludicord.config.mjs` and `tsconfig.json` together. Alias targets cannot use absolute paths or escape the project through `..`. Use project aliases for application-owned modules and package specifiers such as `ludicord/navigation` for framework APIs.

## Development output

The V4 development server binds before source compilation, then prints every discovered prefix:

```text
Ludicord v4.0.0
V4 · Prefix router

  Local:        http://localhost:3000
  Network:      http://10.55.15.113:3000

✓ Server listening
○ Starting compiler...
✓ Ready in 2.4s

Prefixes
┌──────────────┬────────────────────────────────────┐
│ Prefix       │ URL                                │
├──────────────┼────────────────────────────────────┤
│ /            │ http://localhost:3000/             │
│ /docs        │ http://localhost:3000/docs/        │
│ /docs/api    │ http://localhost:3000/docs/api/    │
│ /docs/api/v2 │ http://localhost:3000/docs/api/v2/ │
└──────────────┴────────────────────────────────────┘
```

An invalid initial tree does not prevent the listener from starting. The Activity URL serves a development diagnostics page, and saving a valid source file triggers recovery without changing the port.

## Production behavior

The production build writes `prefix-manifest.json` beside the other generated manifests and compiles each prefix scope as a lazy client boundary. Root global CSS remains in the static entry so switching scopes does not cause an unstyled first frame.

The production server serves only exact discovered prefix paths. A path that is not present in the manifest returns 404. Framework-owned `/_ludicord/*` endpoints remain reserved and cannot be claimed as a prefix.

## Validation rules

The compiler rejects:

- a prefix without its own `pages.tsx`;
- a prefix root that does not initialize `LudicordActivity` and expose `EmbedOutlet`;
- empty, dynamic, grouped, dot-prefixed, or URL-unsafe prefix directory names;
- a prefix colliding with the reserved `/_ludicord` namespace;
- duplicate local embed patterns inside one scope;
- an unknown pathname prefix at runtime.

Run these checks after changing prefix structure:

```bash
npx ludicord routes
npx ludicord lint
npx ludicord build
```

`ludicord routes` displays the recursive prefix tree and the embeds owned by every scope.

## Choosing between an embed and a prefix

Use another embed when the new screen belongs to the same persistent shell, providers, navigation model, and Activity context. Use another prefix when it needs a pathname, an independently mounted shell, separate local route ownership, or a stable boundary for a major product surface.

Do not create a prefix for every screen. Prefix roots are architectural boundaries; embeds remain the lightweight navigation unit inside each boundary.
