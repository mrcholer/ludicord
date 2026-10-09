# Ludicord 4.2.2

Ludicord 4.2.2 improves browser dependency compatibility during development.

## Release summary

- Discover browser dependencies on demand, including CommonJS libraries that need conversion before the browser can load them.
- Add guidance for using native Phaser and Three.js APIs with React effect cleanup, asynchronous imports, and same-origin assets.
- Verify a normal dashboard and isolated Phaser and Three.js examples in development and production, with regression coverage for browser-only dependencies and unchanged plain/Tailwind scaffolds.

## Compatibility

This is a backward-compatible patch for Ludicord 4.x. Public APIs, routing, authentication, WebSocket behavior, server isolation, production compilation, and the default scaffold remain unchanged. Rendering libraries remain optional application dependencies.

The checks cover Phaser 3.90.0 and Three.js 0.186.1 in a browser. They do not establish compatibility with every engine version or replace testing inside the actual Discord Activity frame, including proxy mappings, CSP, audio permissions, mobile input, and GPU limits.

## Upgrade

Update with `npm install ludicord@4.2.2`, update your lockfile, and rebuild your production Activity. Newly generated projects use Ludicord `^4.2.2`. See [native rendering libraries](https://ludicord.extra.codes/docs/engine-compatibility) and the [upgrade guide](https://ludicord.extra.codes/docs/migration).
