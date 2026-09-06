# Start

> Documentation for Ludicord 3.0.1. See [release status](../releases/README.md).


Build once, then run the existing output:

```bash
ludicord build
ludicord start --host 0.0.0.0 --port 3000
```

`ludicord start` loads `.ludicord/build.json`, checks framework compatibility, and starts one production Node server for the Activity, static assets, auth, HTTP APIs, and WebSockets. It does not compile source code or modify the build.

`PORT` and `HOST` environment variables can override configuration. SIGINT and SIGTERM trigger graceful WebSocket and HTTP shutdown. Starting without a build produces `LUDICORD3001`; rebuild when framework versions are incompatible.
