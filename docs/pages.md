# Pages: page.tsx

> Documentation for Ludicord 4.1.0. See [release status](../releases/README.md).

A default-exported React component in `app/page.tsx` renders at `/`. Nested `page.tsx` files render at their directory paths. A page can render plain UI without any embed:

```tsx
// app/game/[id]/page.tsx
import { usePageParams } from "ludicord/navigation";
export default function page() {
  const { id } = usePageParams<"/game/:id">();
  return <main>Game {id}</main>;
}
```

The runtime also passes the decoded parameters as the page's `params` prop. Run `ludicord routes` to regenerate types after adding paths.

To show owned embeds, render one `EmbedOutlet`. When the page has no explicit `LudicordActivity`, the framework supplies that boundary and uses `activity.defaultEmbed` from configuration. An explicit boundary lets a page choose its own default:

```tsx
import { LudicordActivity, EmbedOutlet } from "ludicord";
export default function page() {
  return <LudicordActivity defaultEmbed="home"><EmbedOutlet /></LudicordActivity>;
}
```

Do not hide an explicit Activity boundary in another component: keep it visible in the page so discovery can avoid adding a second one. The Activity initializes Discord, authentication, event stores, safe-area variables and embed routing. State above the outlet survives hash navigation. Moving to another pathname page mounts a new scope; its shell does not inherit the parent page's component state.

## Automatic UI

Automatic files are discovered without imports in the page: `layout.tsx` receives children, `loading.tsx` supplies a fallback, `error.tsx` receives error/reset, `minimize.tsx` supplies compact UI, and `auth/{loading,error,denied}.tsx` supplies sign-in states. Place them beside the page they configure. Embed directories can have their own layout/loading/error files. Production error components receive sanitized errors.

See [embeds](embeds.md), [project structure](project-structure.md), and [migration](migration-v4.md).
