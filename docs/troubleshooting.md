# Troubleshooting

> Documentation for Ludicord 3.0.0. See [release status](../releases/README.md).


Run these first:

```bash
ludicord doctor
ludicord routes
ludicord info
```

- `LUDICORD1001`: create `app/pages.tsx`.
- `LUDICORD1002`: mount both `LudicordActivity` and `EmbedOutlet` in the Activity root.
- Unknown embed: verify the file path and generated route shown by `ludicord routes`.
- Generated route type is stale: keep `ludicord dev` running or run `ludicord build` again.
- Auth is unavailable: set Client ID, Client Secret, and a Session Secret of at least 32 characters.
- 401 API response: routes are authenticated unless they export `auth = false`.
- WebSocket closes immediately: the browser needs a valid Ludicord session cookie and an instance context.
- Voice hooks are empty: request `rpc.voice.read` and inspect `useDiscordDiagnostics()`.
- Activity works in a browser but not Discord: verify HTTPS tunnel reachability and the `/` URL Mapping target.
- `LUDICORD3001`: run `ludicord build` before `ludicord start`.
- Signature verification fails: preserve the exact raw request body and Discord signature/timestamp headers through any reverse proxy.
