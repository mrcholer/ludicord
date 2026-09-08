# Embeds, Navigation, and the Activity Root

Read [pages](https://github.com/mrcholer/ludicord/blob/main/docs/pages.md), [embeds](https://github.com/mrcholer/ludicord/blob/main/docs/embeds.md),
[navigation](https://github.com/mrcholer/ludicord/blob/main/docs/navigation.md), and
[mobile layout](https://github.com/mrcholer/ludicord/blob/main/docs/mobile-layout.md) for the full guides.

## Activity root

`app/pages.tsx` is the persistent React root. It mounts exactly one
`LudicordActivity` and one `EmbedOutlet`:

```tsx
// Correct
import { LudicordActivity, EmbedOutlet } from "ludicord";

export default function Pages() {
  return (
    <LudicordActivity defaultEmbed="home">
      <EmbedOutlet />
    </LudicordActivity>
  );
}
```

- `LudicordActivity` initializes the Discord SDK, shared event stores,
  authentication, safe-area variables, and the embed router once.
- `defaultEmbed` must match a generated embed route.
- Optional `loading` and `errorFallback` props customize lazy-loading and
  recoverable render errors.
- Navigating between embeds replaces only the outlet; state above it stays
  mounted.

```tsx
// Wrong: two outlets, or Next.js-style routing components.
<EmbedOutlet />
<EmbedOutlet />
```

## Automatic files

Create each file with a default-exported component. No imports or wiring in
`pages.tsx` — the compiler owns the registry:

| File | Receives | Purpose |
| --- | --- | --- |
| `app/layout.tsx` | `children` | Project layout above the Activity |
| `app/loading.tsx` | — | Lazy embed/loading fallback |
| `app/error.tsx` | `error`, `reset` | Recoverable render errors |
| `app/minimize.tsx` | — | Compact UI for Discord PiP/grid |
| `app/auth/loading.tsx` | — | Sign-in pending UI |
| `app/auth/error.tsx` | `error`, `reset` | Sign-in failure UI |
| `app/auth/denied.tsx` | — | Access-denied UI |

```tsx
// Correct: app/minimize.tsx stands alone, never imported.
export default function Minimized() {
  return <aside>Your Activity is still running.</aside>;
}
```

```tsx
// Wrong: wiring an automatic file into the root.
// app/pages.tsx
import Minimized from "./minimize"; // never do this
```

Minimize hides the full Activity without unmounting its state or sockets;
Discord returning to focused layout restores it. `useLudicordMinimize()` is
optional. Production error components receive safe messages, never the
original source/stack.

## Embeds

An embed is an internal Activity screen at `app/embeds/<route>/embed.tsx`:

```tsx
// Correct: app/embeds/home/embed.tsx
export default function embed() {
  return <main><h1>Home</h1></main>;
}
```

Routes come from directories:

```text
app/embeds/home/embed.tsx                home
app/embeds/profile/[userId]/embed.tsx    profile/:userId
app/embeds/docs/[...slug]/embed.tsx      docs/*slug
app/embeds/docs/[[...slug]]/embed.tsx    docs/*slug?
```

- Embed modules lazy-load into the persistent `EmbedOutlet`.
- Dynamic values are decoded via `useEmbedParams`; catch-all parameters
  arrive as slash-joined strings.
- Optional loading/error boundaries keep one embed from taking down the root.
- `export default function embed()` is the convention; existing uppercase
  component names remain compatible.
- Duplicate patterns and paths under the reserved `/_ludicord` namespace are
  rejected.

## Navigation

Use the framework embed router; browser pathname routing is intentionally
unused. The current embed is synchronized through the hash
(`#/profile/user-one`) for deep links and browser back/forward, and every
hash is validated against the generated registry:

```tsx
// Correct
import { useEmbedRouter } from "ludicord/navigation";

const router = useEmbedRouter();
router.push("profile/user-one"); // add history
router.replace("home");          // update current entry
router.back();                   // stay inside the Activity
```

`canGoBack` reports whether valid embed history exists. Embed changes update
the hash while keeping the Activity pathname and persistent root stable.

```tsx
// Wrong: reaching for the browser router.
import { useRouter } from "next/router"; // never: no Next.js routing here
```

## Generated route types

`ludicord dev` and `ludicord build` write `ludicord.generated.d.ts`. Its
module augmentation narrows embed, API, and WebSocket route strings and
creates exact dynamic parameter maps. `ludicord-env.d.ts` references it
automatically — application code never imports `.ludicord`:

```tsx
// Correct: typed params from the generated registry.
const params = useEmbedParams<"profile/:userId">();
params.userId;
```

After routes change, keep the development server running or rebuild to
refresh the generated types. A stale generated type means the dev server was
stopped mid-change — restart it or rebuild.

## Mobile and layout

Ludicord installs four CSS custom properties, read from Discord's
`--sait/--saib/--sail/--sair` values first with browser
`env(safe-area-inset-*, 0px)` fallback:

```css
/* Correct: build padding on the framework variables. */
main {
  padding: calc(16px + var(--ludicord-safe-top))
    calc(16px + var(--ludicord-safe-right))
    calc(16px + var(--ludicord-safe-bottom))
    calc(16px + var(--ludicord-safe-left));
}
```

- `--ludicord-safe-top` / `-bottom` / `-left` / `-right`.
- `useLudicordSafeArea()` reads current CSS values.
- `useActivityLayoutMode()`, `useOrientation()`, and `useThermalState()`
  expose SDK updates through the shared event store; reduce expensive
  effects under thermal pressure.
- Ludicord ships no UI component library — use the variables in your own
  layout.
