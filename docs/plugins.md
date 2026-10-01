# Plugins and WebAssembly

Ludicord plugins extend the compiler through the framework configuration. They run in development and production for both the browser graph and server routes, while Ludicord continues to own its compiler configuration.

## Add the WebAssembly plugin

The official WebAssembly plugin ships with `ludicord`:

```js
// ludicord.config.mjs
import { defineConfig } from "ludicord/config";
import { wasm } from "ludicord/plugins/wasm";

export default defineConfig({
  plugins: [wasm()],
});
```

Import a precompiled `.wasm` file from a page, embed, component, API route, or WebSocket route:

```ts
import instantiate, { byteLength, compile } from "./physics.wasm";

const instance = await instantiate({
  env: {
    log(value: number) {
      console.log(value);
    },
  },
});

const exports = instance.exports;
```

The default export instantiates the module and returns `Promise<WebAssembly.Instance>`. `compile()` returns a cached `WebAssembly.Module`, and `byteLength` reports the original binary size. Ludicord generates the `*.wasm` declaration automatically in `ludicord.plugins.generated.d.ts`.

WASM bytes are embedded in the compiled JavaScript module so the same import works in Discord's browser frame and Node server routes without a second asset URL or MIME-type requirement. The default maximum file size is 16 MiB. Raise it deliberately for a larger trusted module:

```js
plugins: [wasm({ maxFileSize: 32 * 1024 * 1024 })]
```

Use dynamic `import()` for a large module that is not required during initial Activity startup so it can remain in a separate client chunk.

## Author a plugin

Use `definePlugin()` for a typed plugin object:

```js
import { defineConfig, definePlugin } from "ludicord/config";

const messages = definePlugin({
  name: "acme:messages",
  declarations: `declare module "virtual:messages" {
    const messages: Readonly<Record<string, string>>;
    export default messages;
  }`,
  resolveId(id) {
    if (id === "virtual:messages") return id;
  },
  load(id, context) {
    if (id !== "virtual:messages") return;
    return `export default ${JSON.stringify({
      runtime: context.target,
      mode: context.mode,
    })}`;
  },
});

export default defineConfig({
  plugins: [messages],
});
```

A plugin has a unique `name`, optional `pre` or `post` enforcement, optional ambient `declarations`, and these hooks:

| Hook | Purpose |
| --- | --- |
| `resolveId(id, importer, context)` | Resolve a file or virtual module identifier |
| `load(id, context)` | Return module source for an identifier |
| `transform(code, id, context)` | Transform an already loaded text module |

The context contains the absolute `projectRoot`, `mode` (`development` or `production`), and `target` (`client` or `server`). A load or transform hook may return source text or `{ code, loader, map }`. Server loaders support `js`, `jsx`, `ts`, `tsx`, `json`, `text`, and `css`; source maps are JSON strings.

Conditional entries are supported:

```js
plugins: [process.env.ANALYZE === "1" && analyzer()]
```

Plugin code executes with the same local access as the config and build command. Install and enable only trusted plugins. Use plugin hooks instead of adding a Vite configuration file; Vite and the server compiler remain Ludicord implementation details.

Changing the plugin list or plugin options triggers the normal controlled development restart because `ludicord.config.mjs` changed. Installing or updating a plugin package still requires restarting the command.
