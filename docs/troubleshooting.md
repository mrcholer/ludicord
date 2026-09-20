# Troubleshooting

> Documentation for Ludicord 4.0.0. See [release status](../releases/README.md).


Run the checks relevant to the failure:

```bash
ludicord routes
ludicord info
ludicord lint
ludicord build
```

Start with the first mapped compile diagnostic rather than restarting repeatedly. Normal embed, API, and WebSocket edits should recover after a successful recompile; the last working server graph remains active when a replacement compile fails.

- `LUDICORD1001`: create `app/page.tsx`.
- `LUDICORD1002`: in a legacy `app/pages.tsx` tree, mount both `LudicordActivity` and `EmbedOutlet`. Unified `page.tsx` files receive an automatic Activity boundary when they omit one.
- `LUDICORD1403`: keep at most one route file in each directory; fix duplicate route patterns or mixed legacy/unified conventions.
- `LUDICORD1501`: legacy prefix structure is invalid; follow the v4 migration guide when changing conventions.
- `LUDICORD1502`: move the scope away from the reserved `/_ludicord` namespace.
- `LUDICORD2004`: the browser pathname does not match a generated Activity prefix; inspect `ludicord routes` and the startup Prefix table.
- Unknown embed: verify the file path and generated route shown by `ludicord routes`.
- Generated route type is stale: keep `ludicord dev` running or run `ludicord build` again.
- Auth is unavailable: set Client ID, Client Secret, and a Session Secret of at least 32 characters.
- 401 API response: routes are authenticated unless they export `auth = false`.
- WebSocket closes immediately: the browser needs a valid Ludicord session cookie and an instance context.
- Voice hooks are empty: request `rpc.voice.read` and inspect `useDiscordDiagnostics()`.
- Activity works in a browser but not Discord: verify HTTPS tunnel reachability and the `/` URL Mapping target.
- `LUDICORD3001`: run `ludicord build` before `ludicord start`.
- Signature verification fails: preserve the exact raw request body and Discord signature/timestamp headers through any reverse proxy.

For deep prefix files, replace brittle traversal imports such as `../../../../../components/sidebar` with `@/components/sidebar`. Ensure existing projects define the matching `@/*` path in `tsconfig.json`; V4 generated projects include it automatically.
