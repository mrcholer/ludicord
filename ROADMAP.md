# Updates and known limitations

This page communicates current work, not release-date commitments.

## Latest published: 3.0.1

The complete Ludicord 3 framework update and its compatibility patch are documented in the [v3 release archive](releases/v3/README.md). The npm registry and [`releases/latest.md`](releases/latest.md) are the authority for what is currently available.

Before deploying your own Activity, complete live Discord checks for OAuth, guild access, mobile/PiP, iframe cookies and multi-user reconnect behavior. These depend on your application and Discord permissions; the automated release tests use fixtures.

## Current boundaries

- No Discord Gateway or bot runtime.
- No bypass of Discord OAuth scopes, privileged intents or guild permissions.
- Single-process rooms; no built-in distributed room adapter.
- No durable module-level state across server edits or restarts.
- Configuration and supported development environment files trigger a controlled development restart. Installed dependency changes still require a manual restart, and OAuth scope changes require re-authorization.
- No framework implementation in this public repository.

Request features through the [issue tracker](https://github.com/mrcholer/ludicord/issues). Inclusion here is not a delivery guarantee.
