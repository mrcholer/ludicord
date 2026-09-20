# Request proxy

Create `app/proxy.ts` to inspect or answer an Activity request before Ludicord selects an API route or static file:

```ts
import { defineProxy } from "ludicord/server";

export default defineProxy((request, { environment }) => {
  const url = new URL(request.url);

  if (url.pathname === "/old") {
    return Response.redirect(new URL("/#/home", url), 307);
  }

  if (environment === "production" && url.pathname === "/maintenance") {
    return Response.json({ unavailable: true }, { status: 503 });
  }

  // Returning undefined continues through Ludicord normally.
});
```

The proxy receives a standard Web `Request` plus `{ environment, projectRoot }`. Return a Web `Response` to stop routing or return `undefined` to continue. `HEAD` responses omit the body, repeated `Set-Cookie` headers are retained, and client disconnects abort `request.signal`.

Ludicord reserves `/_ludicord/*`; the proxy never sees or overrides this namespace. This prevents accidental interception of auth, diagnostics, and framework health endpoints. Proxy errors use the normal development error panel and call `instrumentation.onRequestError` with `source: "proxy"`.

The file is discovered, bundled, and connected automatically. Do not import it from `page.tsx`. Development edits hot-rebuild with the server graph; a compile failure keeps the last working proxy active.

Keep the proxy small. It runs before every ordinary request, so expensive database calls increase latency for assets and pages. Put verified identity authorization, body parsing, and business logic in API routes, where `request.ludicord` and route controls are available.
