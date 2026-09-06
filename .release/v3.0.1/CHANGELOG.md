# Ludicord 3.0.1

This patch release improves clean-clone compatibility checks and keeps generated projects focused on the commands most applications need.

## Create Ludicord App

- Generated `package.json` files now include only `ludicord dev`, `ludicord build`, and `ludicord start` scripts.
- Lint, bundle analysis, route inspection, project information, and direct TypeScript checks remain available as advanced commands in the documentation.
- The focused starter app tree, authenticated API example, and realtime global, Home-viewer, and same-channel counters remain included.

## Compatibility checks

- Source checks now use `pnpm@10.30.3`, which supports every advertised Node.js version, including Node 20.19.
- Clean-clone typechecks build package declarations before checking workspace examples, so `ludicord` and its public subpath types resolve consistently on Linux, Windows, and macOS.
- The release workflow uses the same pinned package-manager version as source checks.
