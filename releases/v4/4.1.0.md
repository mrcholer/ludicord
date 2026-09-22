# Ludicord 4.1.0

Ludicord 4.1.0 adds a supported compiler plugin system and makes WebAssembly the first official plugin.

## Plugin configuration

- Add trusted extensions through `plugins` in `ludicord.config.mjs`.
- Author typed plugins with `definePlugin()` from `ludicord/config`.
- Use `resolveId`, `load`, and `transform` hooks across client and server builds.
- Read the plugin context to distinguish development from production and browser from server compilation.
- Generate ambient project declarations from a plugin without asking users to maintain manual module shims.
- Use conditional false, null, or undefined entries in a plugin list.

## Official WebAssembly plugin

- Import `wasm()` from `ludicord/plugins/wasm` or `ludicord/plugins`.
- Import a precompiled `.wasm` module from a React component, API route, or WebSocket route.
- Instantiate through the default export, reuse the cached `compile()` result, and inspect `byteLength`.
- Use the same module API in development and production without a separate public asset URL or MIME configuration.
- Bound unexpectedly large modules with the configurable 16 MiB default limit.

## Generated projects and builds

- New projects include `ludicord.plugins.generated.d.ts` and reference it from `ludicord-env.d.ts`.
- Production builds retain generated route and plugin declarations under `.ludicord/types`.
- Plugin errors identify the plugin and failing hook with a focused Ludicord diagnostic.

Read [Plugins and WebAssembly](https://ludicord.extra.codes/docs/plugins) for configuration, authoring, trust boundaries, and complete examples.
