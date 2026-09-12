# Updates and known limitations

This page communicates current work, not release-date commitments.

## Latest prepared release: 4.0.0

The complete Ludicord 4 update is documented in the [v4 release archive](releases/v4/README.md). The npm registry and [`releases/latest.md`](releases/latest.md) are the authority for what is currently available. Push this prepared public repository only after the package release is verified.

## V4 direction

V4 focuses on recursive prefix-based routing, prefix-owned React roots and embed registries, typed cross-prefix links, project-root imports, listener-first compilation recovery, clearer startup route reporting, and a rebuilt development diagnostics interface. Read the [V4 release notes](releases/v4/4.0.0.md) and [Prefix Router guide](docs/prefix-router.md).

Before deploying your own Activity, complete live Discord checks for OAuth, guild access, mobile/PiP, iframe cookies and multi-user reconnect behavior. These depend on your application and Discord permissions; the automated release tests use fixtures.

## Current boundaries

- No Discord Gateway or bot runtime.
- No bypass of Discord OAuth scopes, privileged intents or guild permissions.
- Multi-process rooms and shared state require the documented application-supplied adapters; memory implementations remain process-local.
- No durable module-level state across server edits or restarts.
- Configuration and supported development environment files trigger a controlled development restart. Installed dependency changes still require a manual restart, and OAuth scope changes require re-authorization.
- No framework implementation in this public repository.

Request features through the [issue tracker](https://github.com/mrcholer/ludicord/issues). Inclusion here is not a delivery guarantee.
