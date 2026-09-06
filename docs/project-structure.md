# Project Structure

> Documentation for Ludicord 3.0.0. See [release status](../releases/README.md).


```text
app/
  pages.tsx                 persistent Activity root
  globals.css
  layout.tsx                optional project layout
  loading.tsx               optional loading UI
  error.tsx                 optional error UI
  minimize.tsx              optional compact Activity UI
  auth/                     auth loading/error/denied UI
  embeds/<route>/embed.tsx  internal embed screens
  api/<route>/route.ts      HTTP endpoints
  ws/<route>/route.ts       WebSocket endpoints
components/                 shared React components
lib/                        shared application code
public/                     copied static assets
ludicord.config.mjs             framework configuration
ludicord-env.d.ts               ambient and generated type reference
ludicord.generated.d.ts         generated route/config registry
.ludicord/                      disposable production output
```

Dynamic directory names use `[id]`, `[...slug]`, and `[[...slug]]`. The same convention applies to embeds, API routes, and WebSocket routes. Ludicord rejects duplicate patterns and paths under its reserved `/_ludicord` namespace.
