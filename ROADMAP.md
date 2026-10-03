# Updates and known limitations

This page communicates current work, not release-date commitments.

## Latest stable release: 4.1.1

The current stable release is documented in the
[4.1.1 release notes](releases/v4/4.1.1.md). The npm registry and
[`releases/latest.md`](releases/latest.md) are the authority for what is
currently available.

## Current direction

Current work focuses on predictable Activity startup, secure production
delivery, typed compiler plugins, WebAssembly workflows, version-matched coding
agent guidance, and examples that exercise the public API. Read the
[release archive](releases/v4/README.md), [plugin guide](docs/plugins.md), and
[support policy](https://ludicord.extra.codes/docs/support-policy).

Before deploying your own Activity, complete live Discord checks for OAuth, guild access, mobile/PiP, iframe cookies and multi-user reconnect behavior. These depend on your application and Discord permissions; the automated release tests use fixtures.

## Current boundaries

- No Discord Gateway or bot runtime.
- No bypass of Discord OAuth scopes, privileged intents or guild permissions.
- Multi-process rooms and shared state require the documented application-supplied adapters; memory implementations remain process-local.
- No durable module-level state across server edits or restarts.
- Configuration and supported development environment files trigger a controlled development restart. Installed dependency changes still require a manual restart, and OAuth scope changes require re-authorization.
- No framework implementation in this public repository.

Request features through the [issue tracker](https://github.com/mrcholer/ludicord/issues). Inclusion here is not a delivery guarantee.
