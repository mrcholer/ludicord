# Activity Rooms

> Documentation for Ludicord 3.1.0. See [release status](../releases/README.md).


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

## Choosing a broadcast scope

`client.activity.broadcast()` reaches only clients on the same WebSocket route and verified Activity instance. This is the safe default for multiplayer state. `client.room` creates an additional named room inside that route. `client.route.broadcast()` is deliberately explicit because it reaches every authenticated client on the route, across Activity instances.

Route handlers also receive a server context:

```ts
events: {
  async count(client, _data, server) {
    client.emit("audience", {
      local: server.activity.clientCount(
        client.ludicord.applicationId,
        client.ludicord.instanceId!,
      ),
      total: await server.activity.totalClientCount(
        client.ludicord.applicationId,
        client.ludicord.instanceId!,
      ),
    });
  },
}
```

`clientCount()` is synchronous and counts clients in the current process. `totalClientCount()` can use a configured `LudicordWebSocketAdapter` to count all replicas. Without an adapter, both represent the current process.
