# V4 Prefix Router

Read the public [Prefix Router guide](https://github.com/mrcholer/ludicord/blob/main/docs/prefix-router.md) and [V4 migration guide](https://github.com/mrcholer/ludicord/blob/main/docs/migration-v4.md) when creating, moving, reviewing, or debugging a pathname scope.

## Scope convention

A scope is `app/prefix/<static-segment>/`. It directly owns:

- required `pages.tsx` with one `LudicordActivity` and one `EmbedOutlet`;
- optional local `embeds/` routes;
- optional nested `prefix/<segment>/` scopes.

Do not put a nested scope directly under another segment; recursion always passes through the literal `prefix/` directory. Do not use dynamic, grouped, dot-prefixed, empty, or `/_ludicord` segments.

## Route ownership

The pathname selects a scope. The hash selects a local embed:

```text
app/prefix/docs/prefix/api/embeds/auth/embed.tsx
→ /docs/api/#/auth
```

Two scopes may own the same local embed name. Check `ludicord.generated.d.ts` and `ludicord routes`; never flatten or guess the generated ownership map.

## Navigation choice

- Use `Link` or `useEmbedRouter()` for an embed inside the active prefix.
- Use `PrefixLink` for accessible user navigation to another prefix.
- Use `prefixHref()` only when an API requires a URL string.
- Use `useActivityPrefix()` to read the current scope.

Cross-prefix navigation mounts another `pages.tsx`; do not promise provider or component state survives it. Local embed navigation keeps the current scope root mounted.

## Import aliases

Read the project's `imports.aliases` map. A generated V4 project begins with:

```js
imports: {
  aliases: {
    "@/components": "./components",
    "@/lib": "./lib",
    "@": ".",
  },
}
```

The matching TypeScript `paths` config must resolve the same imports. Alias values are project-relative and cannot escape through `..`. Do not add an alias for `ludicord`, React, or another dependency.

## Verification

Run `ludicord routes` and confirm every scope owns the expected embeds. Then run the production build and request each prefix pathname directly. Unknown production prefixes must return 404. Test both browser preview and Discord when the change affects SDK, auth, participants, voice, safe areas, or launch mappings.
