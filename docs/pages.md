# Activity root: pages.tsx

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


`app/pages.tsx` is the persistent React root for the `/` prefix. It must mount `LudicordActivity` and expose `EmbedOutlet`:

```tsx
import { LudicordActivity, EmbedOutlet } from "ludicord";

export default function Pages() {
  return (
    <LudicordActivity defaultEmbed="home">
      <EmbedOutlet />
    </LudicordActivity>
  );
}
```

`LudicordActivity` initializes the official Discord Embedded App SDK, shared Discord event stores, authentication, safe-area variables, and the embed router once. Navigating between embeds replaces only the outlet and synchronizes typed hash history; state placed above it remains mounted.

The default embed must match a generated embed route. Optional `loading` and `errorFallback` props customize lazy-loading and recoverable render errors.

V4 applies the same explicit contract to every `app/prefix/<segment>/pages.tsx`. A prefix root owns the providers and shell that survive hash navigation inside that pathname scope. Keep `LudicordActivity` and `EmbedOutlet` visible in each `pages.tsx`; do not hide the compiler boundary inside a shared wrapper. See [V4 Prefix Router](prefix-router.md).

## Automatic files

Create these files with a default-exported React component; no imports or wiring in `pages.tsx` are needed:

- `app/layout.tsx`: receives `children`; stays above the Activity.
- `app/loading.tsx`: lazy embed/loading fallback.
- `app/error.tsx`: receives `error` and `reset`.
- `app/minimize.tsx`: compact UI for Discord PiP/grid and `useLudicordMinimize()`.
- `app/auth/loading.tsx`, `app/auth/error.tsx`, `app/auth/denied.tsx`: sign-in screens. Auth error receives `error` and `reset`.

The compiler owns the file registry and minimize provider. Root automatic UI remains application-wide; prefix scopes own their local Activity root and embed tree. Minimize hides the full Activity without unmounting its state or sockets; Discord returning to focused layout restores it. The manual minimize hook is optional. Production error components receive safe messages, never the original source/stack.
