# API Routes

> Documentation for Ludicord 3.0.0. See [release status](../releases/README.md).


Create `app/api/hello/route.ts`:

```ts
import type { LudicordRequest } from "ludicord/server";

export function GET(request: LudicordRequest) {
  return Response.json({ user: request.ludicord?.user });
}
```

Handlers use native `Request` and `Response` objects. Export `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, or `OPTIONS`. Ludicord adds `request.params`, `request.ludicord`, and `request.verification`. Dynamic directories create typed parameters.

Routes require a valid Ludicord session by default. Set `export const auth = false` for a public route. Authenticated handlers should trust identity from `request.ludicord`, never user IDs supplied in a request body.

Ludicord returns 404 for no route, 405 with `Allow` for unsupported methods, supplies HEAD from GET, and supplies OPTIONS when no custom handler exists. API and Activity traffic run on the same Node server.
