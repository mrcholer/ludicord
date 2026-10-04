# Ludicord 4.2.1

Ludicord 4.2.1 fixes two edge cases in client WebSocket retry scheduling.

## Release summary

- Preserve scheduled reconnect backoff when `LudicordWebSocketConnection.start()` is called repeatedly while a retry is pending.
- Keep zero-delay retry calculations finite for large retry budgets instead of producing `NaN` after exponential overflow.
- Preserve explicit `reconnect()` behavior: cancel the pending retry and connect immediately.

## Compatibility

This is a backward-compatible patch for Ludicord 4.x. Configured retry budgets, jitter, ceilings, authentication, diagnostics APIs, and developer-owned UI remain unchanged. No missed application actions are replayed automatically.

The regression tests cover preservation of the original retry deadline, cancellation of the old timer on explicit reconnect, and 1100 zero-delay retries.

## Upgrade

Update with `npm install ludicord@4.2.1`, update your lockfile, and rebuild your production Activity. Newly generated projects use Ludicord `^4.2.1`. See [WebSockets](https://ludicord.extra.codes/docs/websockets) and the [upgrade guide](https://ludicord.extra.codes/docs/migration).
