# Activity Rooms

> Preview documentation for the upcoming 2.2.4 release. npm currently provides ludicord 2.2.1 and create-ludicord-app 2.2.3. See [release status](../releases/README.md) before using new features.


Every authenticated WebSocket client can join the Activity Instance room:

```ts
connect(client) {
  client.activity.join();
  client.activity.broadcast("joined", {
    userId: client.ludicord.user.id,
  });
}
```

The internal room identity combines the WebSocket route namespace, Discord application ID and Activity instance ID. Two instances of the same Activity are isolated from each other. A broadcast never trusts a client-provided application or instance identifier; those values come from the encrypted server session.

Leave/broadcast behavior is also available in `disconnect`. Ludicord removes all room membership when a socket closes, fails heartbeat checks, or violates payload/backpressure limits.
