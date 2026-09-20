# V4 page scopes and prefix navigation

Start with one `app/page.tsx` and embeds such as `app/home/embed.tsx`. Only add independent pathname scopes for a large project's separate surfaces or a concrete requirement for a distinct URL, shell, or provider lifetime. State that requirement first. Realtime, more screens, deeper folders and a v4 upgrade alone are not reasons.

In unified v4 routing, `app/docs/api/page.tsx` owns `/docs/api`. Its child `auth/embed.tsx` owns `/docs/api#/auth`. Do not introduce literal `prefix/` or `embeds/` scaffolding. These names become ordinary URL segments. Legacy root `pages.tsx` projects retain their existing compatibility convention until deliberately migrated.

Use `page.tsx` for pathname UI, `route.ts` for HTTP, `socket.ts` for WebSockets and `embed.tsx` for a hash screen. At most one can exist in each directory. Every embed belongs to its nearest ancestor page; intervening pages start a new scope. `[id]` parameters work for every kind, and embeds inherit their page's parameters. Do not duplicate parameter names or claim `/_ludicord`.

Read the installed `dist/docs/project-structure.md`, `dist/docs/prefix-router.md`, and `dist/docs/migration-v4.md` for examples. Confirm actual ownership and types with `ludicord routes` and `ludicord.generated.d.ts`.

Use `Link`/`useEmbedRouter()` inside a page. Use `PrefixLink`/`prefixHref()` between justified page paths; those load a new document and reset client providers. `useActivityPrefix()` reads the concrete pathname, `usePageParams()` reads decoded page parameters, and `useEmbedParams()` includes inherited page parameters. Separate shells never replace server authorization.

Keep `imports.aliases` and TypeScript paths synchronized. Test direct page URLs, scoped hashes, dynamic values, back/forward, route mutations, lint and production builds. Test Discord itself when SDK, authorization or launch mappings change.
