# Embeds

> Documentation for Ludicord 4.0.1. See [release status](../releases/README.md).


An embed is an internal Activity screen owned by its nearest ancestor page. Create `app/home/embed.tsx` for the root page:

```tsx
export default function embed() {
  return <main><h1>Home</h1></main>;
}
```

Routes come from directories:

```text
app/home/embed.tsx                home
app/profile/[userId]/embed.tsx    profile/:userId
app/docs/[...slug]/embed.tsx      docs/*slug
app/docs/[[...slug]]/embed.tsx    docs/*slug?
```

Embed modules are lazy-loaded into the persistent `EmbedOutlet`. Dynamic values are decoded and available through `useEmbedParams`. Catch-all parameters are returned as slash-joined strings. Optional loading and error boundaries prevent one embed from taking down the Activity root.

For example, `app/docs/page.tsx` owns `app/docs/start/embed.tsx`, producing `/docs#/start`. The nearest ancestor page owns an embed; a nested page starts a new scope. In `app/game/[id]/players/embed.tsx`, `useEmbedParams()` includes the parent page's `id`. Another page may reuse the same local embed name. See [page scopes](prefix-router.md).

The file convention is `app/<route>/embed.tsx`. Use `export default function embed()`; Ludicord supplies the internal React Refresh component name while preserving source maps. Existing uppercase component names remain compatible.
