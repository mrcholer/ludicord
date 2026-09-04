# Validate a Ludicord change

Run commands with the project's selected package manager.

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

## Interpret failures

- Fix the first Ludicord or TypeScript diagnostic at its mapped source file, line and column.
- In development, correct source errors and let the overlay and terminal compilation recover; do not restart for normal TSX, API or WebSocket edits.
- Restart after changing `ludicord.config.mjs`, `.env.local`, dependencies, installed Ludicord version or Discord OAuth scopes.
- Use `ludicord routes` to confirm new embeds, APIs and sockets were discovered.
- Use `ludicord doctor` to catch exposed secrets, unsupported imports and deployment configuration problems.
- Test once in a browser fallback and once inside the Discord Activity frame when the feature depends on SDK, guild, participant, voice, mobile or picture-in-picture behavior.

Do not report success from typechecking alone when the request changes runtime behavior.
