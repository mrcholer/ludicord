# Ludicord 4.2.3

Ludicord 4.2.3 makes it easier to diagnose an Activity's local production setup.

## Release summary

- Run `ludicord info --check` to check required Discord settings and get warnings about unrestricted hosts and origins. The command reports missing settings by name and keeps credential values out of the output.
- Run CLI commands from projects with `app/page.tsx` even when they rely on the default configuration.
- Use the updated guidance for refreshing Phaser and Three.js embeds during development. Chromium regression checks cover renderer replacement, parent state, and cleanup on navigation.

## Upgrade

Install `ludicord@4.2.3`, update your lockfile, and rebuild your Activity. See the [CLI reference](https://ludicord.extra.codes/docs/cli) and [native renderer guide](https://ludicord.extra.codes/docs/engine-compatibility).
