# Navigation and generated route types

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).


Use the Ludicord embed router; browser pathname routing is intentionally not used. The current embed is synchronized through the hash (`#/profile/user-one`) for deep links and browser back/forward, and hashes are validated against the generated registry:

```tsx
import { useEmbedRouter } from "ludicord/navigation";

const router = useEmbedRouter();
router.push("profile/user-one");
router.replace("home");
router.back();
```

`push` adds a valid embed history entry, `replace` updates the current entry, and `back` stays inside the Activity. `canGoBack` indicates whether valid embed history exists. The hash changes, but the Activity pathname and persistent React root stay stable.

`ludicord dev` and `ludicord build` write `ludicord.generated.d.ts`. Its module augmentation narrows embed, API, and WebSocket route strings and creates exact dynamic parameter maps. `ludicord-env.d.ts` references it automatically, so application code never imports `.ludicord`.

```tsx
const params = useEmbedParams<"profile/:userId">();
params.userId;
```

After routes change, keep the development server running or rebuild to refresh the generated types.
