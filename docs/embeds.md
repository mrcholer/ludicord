# Embeds

> Documentation for Ludicord 3.1.1. See [release status](../releases/README.md).


An embed is an internal Activity screen. Create `app/embeds/home/embed.tsx`:

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

The file convention is `app/embeds/<route>/embed.tsx`. Use `export default function embed()`; Ludicord supplies the internal React Refresh component name while preserving source maps. Existing uppercase component names remain compatible.
