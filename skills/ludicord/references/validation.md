# Validate a Ludicord change

Run commands with the project's selected package manager:

```bash
npm run doctor
npm run routes
npm run typecheck
npm run build
```

If scripts are absent, run the package CLI directly:

```bash
npx ludicord doctor
npx ludicord routes
npx tsc --noEmit
npx ludicord build
```

`doctor` checks configuration, environment, security warnings, port
availability, build compatibility, and secret leakage. `routes` confirms new
embeds, APIs, and sockets were discovered. `info` adds environment/project
detail when a failure looks environmental.

## Interpret failures

- Fix the first Ludicord or TypeScript diagnostic at its mapped source file,
  line, and column — never work around it elsewhere.
- In development, correct source errors and let the overlay and terminal
  compilation recover; do not restart for normal TSX, API, or WebSocket
  edits. A failed hot-replacement keeps the previous working route.
- Restart after changing `ludicord.config.mjs`, `.env.local`, dependencies,
  the installed Ludicord version, or Discord OAuth scopes (and re-authorize
  for scope changes).
- Use `ludicord routes` to confirm every new or renamed embed, API, and
  socket; a stale generated type means dev was stopped mid-change.
- Use `ludicord doctor` to catch exposed secrets, unsupported imports, and
  deployment configuration problems. Rotate a secret immediately on an
  exposure report.
- Test once in a browser fallback and once inside the Discord Activity frame
  when the feature depends on SDK, guild, participant, voice, mobile, or
  picture-in-picture behavior.

Do not report success from typechecking alone when the request changes
runtime behavior. All four checks pass before the change is done.
