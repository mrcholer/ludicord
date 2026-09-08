# Validate a Ludicord change

Generated projects always provide the production-critical commands:

```bash
npm run build
```

Run advanced checks directly through the project's package runner when they
apply to the change:

```bash
npx ludicord routes
npx ludicord lint
npx tsc --noEmit
npx ludicord build
```

`routes` confirms new embeds, APIs, and sockets were discovered. `lint`
checks React Hooks rules. The project typecheck confirms application types
when such a script/config is present. `build` performs the production gate
and client-secret scan. `info` adds environment/project detail when a failure
looks environmental.

## Interpret failures

- Fix the first Ludicord or TypeScript diagnostic at its mapped source file,
  line, and column — never work around it elsewhere.
- In development, correct source errors and let the overlay and terminal
  compilation recover; do not restart for normal TSX, API, or WebSocket
  edits. A failed hot-replacement keeps the previous working route.
- Let the controlled dev restart handle `ludicord.config.mjs` and supported
  environment-file edits. Start a fresh command after dependency or installed
  framework changes, and re-authorize for Discord OAuth scope changes.
- Use `ludicord routes` to confirm every new or renamed embed, API, and
  socket; a stale generated type means dev was stopped mid-change.
- Use the production build's client-secret scan and review environment output
  before sharing it. Rotate a secret immediately on an exposure report.
- Test once in a browser fallback and once inside the Discord Activity frame
  when the feature depends on SDK, guild, participant, voice, mobile, or
  picture-in-picture behavior.

Do not report success from typechecking alone when the request changes
runtime behavior. Every applicable check must pass before the change is done.
