# Native rendering libraries

Ludicord remains a general-purpose React framework for Discord Activities.
Ordinary projects need no rendering engine, additional scene folders, or special
runtime configuration. Install a library in your own app only when you need it.

## Initialize in a React effect

Pages and embeds are browser components. Keep browser-only initialization in an
effect; do not import an engine into `route.ts`, `socket.ts`, instrumentation, or
another server module. A dynamic import also keeps an optional engine in a
separate production chunk. Guard asynchronous completion against unmount:

```tsx
import { useEffect, useRef } from "react";
import type Phaser from "phaser";

export default function embed() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | undefined;
    const parent = host.current;
    if (!parent) return;
    void import("phaser").then(({ default: Phaser }) => {
      if (cancelled) return;
      game = new Phaser.Game({
        type: Phaser.AUTO, parent, width: 640, height: 360,
        scene: { create() { this.add.text(24, 24, "Hello Activity"); } },
      });
    }).catch((error: unknown) => { if (!cancelled) console.error(error); });
    return () => { cancelled = true; game?.destroy(true); };
  }, []);
  return <div ref={host} />;
}
```

Use the original engine APIs. React Strict Mode replays effect setup and cleanup
in development. Route transitions and Fast Refresh can also unmount or restart
effects. The cancellation guard prevents a late import from creating a renderer
after the component has left the page.

## Three.js

Install `three` and, when needed for TypeScript, `@types/three`. Load the native
module with `import("three")` and loaders with their native subpaths, for example
`import("three/addons/loaders/GLTFLoader.js")`.

Create the scene, camera and `WebGLRenderer` inside the effect. Attach the canvas
to the component's ref. Use `renderer.setAnimationLoop(callback)` for rendering
and set it to `null` in cleanup. Disconnect `ResizeObserver`, dispose geometries,
materials and textures, dispose the renderer, and remove its canvas. Resources
loaded after unmount also need disposal. A material's disposal does not dispose
its textures. See the [Three.js disposal guide](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).

Sizing should follow the element's dimensions. Update the renderer dimensions,
camera aspect and projection matrix when the element resizes. For Phaser, use
its native scale manager and destroy the game on cleanup; see the
[Phaser Game API](https://docs.phaser.io/api-documentation/class/game).

## Assets and compiler behavior

Put assets in `public/` and use same-origin URLs such as `/models/scene.glb`.
Ludicord copies public files to the production client output. For imported asset
formats that the underlying compiler does not recognize, use an explicit URL
import (`import modelUrl from "./scene.glb?url"`) or place the asset in `public/`.
Shader source can be imported as text with `?raw`. These use existing compiler
facilities; no custom asset loader is required. WebAssembly module imports use
the existing optional [WASM plugin](plugins.md).

The development compiler discovers requested browser dependencies on demand,
including packages needing CommonJS-to-ES-module conversion. It does not scan
server routes as browser entry points. Production continues to use its existing
client bundler and separate Node server graph. No Vite configuration is needed.

## Verification limits

The isolated compatibility fixtures exercise Phaser 3.90.0 with Canvas/Arcade
physics and Three.js 0.186.1 with WebGL, texture loading and a glTF model. Their
normal dashboard has no engine imports. Version and environment results belong
to those checks; they do not establish compatibility with all engine releases,
PixiJS, Babylon.js, PlayCanvas or React Three Fiber.

Test the actual Discord Activity frame separately. Browser success does not
verify Discord proxy mappings, CSP, audio permissions, touch input, mobile GPU
limits, layout events or picture-in-picture. Use same-origin assets where
possible and retain the framework's authentication and origin protections.
