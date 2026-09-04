# Updates and known limitations

This page communicates current work, not release-date commitments.

## Upcoming 2.2.4

Automatic Activity files, server hot updates, branded diagnostics, richer permission-gated Discord data and runtime/security fixes are documented in the [preview notes](releases/2.2.4.md).

Before publication, complete live Discord checks for OAuth, guild access, mobile/PiP, iframe cookies and multi-user reconnect behavior.

## Current boundaries

- No Discord Gateway or bot runtime.
- No bypass of Discord OAuth scopes, privileged intents or guild permissions.
- Single-process rooms; no built-in distributed room adapter.
- No durable module-level state across server edits or restarts.
- No automatic hot reload of installed framework packages, configuration or OAuth scope changes.
- No framework implementation in this public repository.

Request features through the [issue tracker](https://github.com/mrcholer/ludicord/issues). Inclusion here is not a delivery guarantee.
