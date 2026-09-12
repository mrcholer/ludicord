# Embeds

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


An embed is an internal Activity screen owned by one prefix scope. Create `app/embeds/home/embed.tsx` for the root scope:

```tsx
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

Embed modules are lazy-loaded into the persistent `EmbedOutlet`. Dynamic values are decoded and available through `useEmbedParams`. Catch-all parameters are returned as slash-joined strings. Optional loading and error boundaries prevent one embed from taking down the Activity root.

In V4, `app/prefix/docs/embeds/start/embed.tsx` is the local `start` embed for `/docs`, producing `/docs/#/start`. Another scope may also own `start`; generated types preserve the ownership boundary. See [V4 Prefix Router](prefix-router.md).

The file convention is `app/embeds/<route>/embed.tsx`. Use `export default function embed()`; Ludicord supplies the internal React Refresh component name while preserving source maps. Existing uppercase component names remain compatible.
