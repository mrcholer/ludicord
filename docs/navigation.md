# Navigation and generated route types

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


Use the in-memory embed router; browser pathname navigation is intentionally not used. The current embed is mirrored into the hash (`#/profile/user-one`) for deep links, and hashes are validated against the registry:

```tsx
import { useEmbedRouter } from "ludicord/navigation";

const router = useEmbedRouter();
router.push("profile/user-one");
router.replace("home");
router.back();
```

`push` adds history, `replace` updates the current entry, and `back` stays inside the Activity. `canGoBack` indicates whether internal history exists.

`ludicord dev` and `ludicord build` write `ludicord.generated.d.ts`. Its module augmentation narrows embed, API, and WebSocket route strings and creates exact dynamic parameter maps. `ludicord-env.d.ts` references it automatically, so application code never imports `.ludicord`.

```tsx
const params = useEmbedParams<"profile/:userId">();
params.userId;
```

After routes change, keep the development server running or rebuild to refresh the generated types.
