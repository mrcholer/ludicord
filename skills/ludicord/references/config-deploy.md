# Configuration, CLI, Deployment, and Troubleshooting

Read [configuration](https://github.com/mrcholer/ludicord/blob/main/docs/configuration.md),
[CLI reference](https://github.com/mrcholer/ludicord/blob/main/docs/cli.md), [deployment](https://github.com/mrcholer/ludicord/blob/main/docs/deployment.md),
[build](https://github.com/mrcholer/ludicord/blob/main/docs/build.md), [start](https://github.com/mrcholer/ludicord/blob/main/docs/start.md), and
[troubleshooting](https://github.com/mrcholer/ludicord/blob/main/docs/troubleshooting.md) for the full guides.

## Configuration

Create `ludicord.config.mjs` in the application root — it is the single
configuration source:

```js
// Correct
import { defineConfig } from "ludicord/config";

export default defineConfig({
  discord: { scopes: ["identify", "guilds"] },
  activity: { defaultEmbed: "home", outsideDiscord: "error" },
  server: { port: 3000 },
});
```

- The Client ID may come from `LUDICORD_DISCORD_CLIENT_ID`. Keep secrets in
  server environment variables, never config literals or client imports.
- Never create `vite.config.*` — Vite is an internal compiler detail and
  the file is ignored. Tailwind is detected from `@tailwindcss/vite` in the
  app.

Key settings:

| Setting | Default | Meaning |
| --- | --- | --- |
| `discord.clientId` | Environment value | Public Discord application ID |
| `discord.scopes` | `["identify"]` | Requested OAuth scopes |
| `discord.auth.required` | `true` | Require login for the Activity |
| `discord.auth.session` | `"encrypted-cookie"` | Supported session mechanism |
| `discord.auth.proxyVerification` | `false` | Signed-request verification |
| `discord.auth.activityInstanceVerification` | `false` | REST instance verification |
| `activity.defaultEmbed` | `"home"` | Initial registered embed |
| `activity.outsideDiscord` | `"error"` | `error`, `allow`, or `mock` outside Discord |
| `server.port` / `server.host` | `3000` / `"0.0.0.0"` | Listening port/interface |
| `server.allowedHosts` | `true` | All hosts or an explicit list |
| `server.limits.body` | `"2mb"` | HTTP request body limit |

Allow mode does not fabricate Discord identity. Mock mode is for
development/testing, never a substitute for production authentication.
Invalid configuration values produce diagnostics. Restart development after
configuration changes; renew authorization after OAuth scope changes.

## CLI

Run commands through generated package scripts or the installed executable:

| Command | Purpose |
| --- | --- |
| `ludicord --help` | Show commands — discover flags here, never guess them |
| `ludicord --version` | Print installed framework version |
| `ludicord dev` | Development server, hot updates, diagnostics |
| `ludicord build` | Validate, typecheck, production build |
| `ludicord start` | Serve an existing production build |
| `ludicord routes` | List discovered routes |
| `ludicord doctor` | Diagnose configuration and build issues |
| `ludicord info` | Environment/project information |
| `ludicord clean` | Remove generated `.ludicord` output |

`dev` supports `--port`/`-p`, `--host`/`-H`, `--open`, `--debug`, and
`--no-hmr`. `start` supports host/port overrides; it never compiles or
opens a preview. Share diagnostics only after reviewing them for secrets.

Project generator:

```bash
npx create-ludicord-app@latest my-activity --tailwind
npx create-ludicord-app@latest my-activity --no-tailwind
npx create-ludicord-app@latest my-activity --package-manager pnpm
npx create-ludicord-app@latest my-activity --package-manager npm --no-install
```

The target must be empty. Interactive runs ask about Tailwind; automated
runs keep it by default (`--no-tailwind` for the plain-CSS starter).
`--no-install` writes the starter without installing. Generator and
framework versions can differ — inspect `package.json` and the lockfile.

## Deployment

Deploy to Node.js 20.19+ with long-lived HTTP upgrades for WebSockets:

1. Install with a locked dependency file.
2. Set server-only environment variables on the hosting platform.
3. Run `ludicord build` during the build stage.
4. Persist the generated `.ludicord` directory into the runtime image.
5. Run `ludicord start` and route HTTP and WebSocket traffic to the same port.
6. Serve the public origin over HTTPS and configure that hostname in Discord
   Activity URL Mapping.

- Never place a CDN cache in front of `/_ludicord/auth`, authenticated
  `/api/*`, or `/ws/*`.
- When a reverse proxy terminates TLS, preserve host/protocol headers and
  WebSocket upgrade headers (signature verification needs the exact raw
  body plus Discord signature/timestamp headers).
- Sessions use secure partitioned cookies in production — test the final
  iframe origin, not just a direct server URL.
- Never hand-edit `.ludicord/` or build output; regenerate with the
  framework.

## Troubleshooting

Run these first, in order:

```bash
npx ludicord doctor
npx ludicord routes
npx ludicord info
```

| Symptom | Cause and fix |
| --- | --- |
| `LUDICORD1001` | Create `app/pages.tsx` |
| `LUDICORD1002` | Mount both `LudicordActivity` and `EmbedOutlet` in the root |
| Unknown embed | Verify the file path and generated route via `ludicord routes` |
| Stale generated route type | Keep `ludicord dev` running or rebuild |
| Auth unavailable | Set Client ID, Client Secret, and a ≥ 32-char Session Secret |
| 401 API response | Routes are authenticated unless they export `auth = false` |
| WebSocket closes immediately | Browser needs a valid session cookie and instance context |
| Voice hooks empty | Request `rpc.voice.read`; inspect `useDiscordDiagnostics()` |
| Works in browser, not Discord | Verify HTTPS tunnel reachability and the `/` URL Mapping target |
| `LUDICORD3001` | Run `ludicord build` before `ludicord start` |
| Signature verification fails | Preserve the raw body and signature/timestamp headers through proxies |

If an approach fails after 2–3 attempts, stop retrying the same command:
reread the subsystem guide, inspect the error precisely, and check
`ludicord info` for environment mismatches.
