# Activity root: pages.tsx

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


`app/pages.tsx` is the persistent React root. It must mount `LudicordActivity` and expose `EmbedOutlet`:

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

`LudicordActivity` initializes the official Discord Embedded App SDK, shared Discord event stores, authentication, safe-area variables, and the in-memory embed router once. Navigating between embeds replaces only the outlet; state placed above it remains mounted.

The default embed must match a generated embed route. Optional `loading` and `errorFallback` props customize lazy-loading and recoverable render errors.

## Automatic files

Create these files with a default-exported React component; no imports or wiring in `pages.tsx` are needed:

- `app/layout.tsx`: receives `children`; stays above the Activity.
- `app/loading.tsx`: lazy embed/loading fallback.
- `app/error.tsx`: receives `error` and `reset`.
- `app/minimize.tsx`: compact UI for Discord PiP/grid and `useLudicordMinimize()`.
- `app/auth/loading.tsx`, `app/auth/error.tsx`, `app/auth/denied.tsx`: sign-in screens. Auth error receives `error` and `reset`.

The compiler owns the file registry and minimize provider. Minimize hides the full Activity without unmounting its state or sockets; Discord returning to focused layout restores it. The manual minimize hook is optional. Production error components receive safe messages, never the original source/stack.
