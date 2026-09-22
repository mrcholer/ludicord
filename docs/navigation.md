# Navigation and generated route types

> Documentation for Ludicord 4.1.0. See [release status](../releases/README.md).


Inside one prefix scope, use the Ludicord embed router. The current local embed is synchronized through the hash (`#/profile/user-one`) for deep links and browser back/forward, and hashes are validated against that prefix's generated registry:

```tsx
import { useEmbedRouter } from "ludicord/navigation";

const router = useEmbedRouter();
router.push("profile/user-one");
router.replace("home");
router.back();
```

`push` adds a valid local embed history entry, `replace` updates the current entry, and `back` stays inside the Activity scope. `canGoBack` indicates whether valid embed history exists. The hash changes, but the current prefix pathname and persistent React root stay stable.

Use `PrefixLink` or `prefixHref()` to navigate to another pathname scope:

```tsx
import { PrefixLink, prefixHref } from "ludicord";

<PrefixLink prefix="/docs/api" embed="auth">API authentication</PrefixLink>;
const users = prefixHref("/docs/api/v2", "users");
```

`useActivityPrefix()` returns the current normalized prefix. Cross-prefix navigation intentionally mounts the destination scope's `page.tsx`; local embed navigation does not.

`ludicord dev` and `ludicord build` write `ludicord.generated.d.ts`. Its module augmentation narrows prefixes, each prefix's local embeds, API and WebSocket route strings, and exact dynamic parameter maps. `ludicord-env.d.ts` references it automatically, so application code never imports `.ludicord`.

```tsx
const params = useEmbedParams<"profile/:userId">();
params.userId;
```

After routes change, keep the development server running or rebuild to refresh the generated types.
