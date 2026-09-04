# Deployment

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


Deploy Ludicord to a Node.js 20.19+ environment that supports long-lived HTTP upgrades for WebSockets.

1. Install with a locked dependency file.
2. Set server-only environment variables in the hosting platform.
3. Run `ludicord build` during the build stage.
4. Persist the generated `.ludicord` directory into the runtime image.
5. Run `ludicord start` and route both HTTP and WebSocket traffic to the same port.
6. Serve the public origin over HTTPS and configure that hostname in Discord Activity URL Mapping.

Do not place a CDN cache in front of `/_ludicord/auth`, authenticated `/api/*`, or `/ws/*`. If a reverse proxy terminates TLS, preserve the host/protocol headers and WebSocket upgrade headers. Sessions use secure partitioned cookies in production, so test the final iframe origin rather than only a direct server URL.
