# Ludicord 4.1.2

Ludicord 4.1.2 makes restricted host configuration work automatically with your application's Discord Activity proxy domain.

## Release summary

- Automatically include `<application-id>.discordsays.com` in explicit `server.allowedHosts` lists using your configured Discord application ID.
- Apply the same host policy to HTTP requests, WebSocket upgrades, and development assets.
- Use the effective production application ID, including runtime environment overrides, when resolving the Activity hostname.
- Reject malformed Host values while continuing to reject unrelated Activity domains under a restricted host list.

## Configuration

Keep your deployment or tunnel hostname in `server.allowedHosts`. Ludicord adds only your application's exact Discord proxy hostname when the application ID is valid; it does not add a wildcard for other applications. The existing `server.allowedHosts: true` default remains unrestricted.

Host acceptance does not authenticate a player or establish Activity membership. Origin, authentication, session, and route authorization checks remain in effect.

Update with `npm install ludicord@4.1.2`, update your lockfile, and rebuild your production Activity. Newly generated projects also use Ludicord `^4.1.2`.
