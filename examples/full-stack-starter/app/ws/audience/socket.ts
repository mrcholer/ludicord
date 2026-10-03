import { defineWS } from "ludicord/ws/server";
import type { LudicordWebSocketClient } from "ludicord/ws/server";

interface Viewer {
  readonly client: LudicordWebSocketClient;
  readonly userId: string;
  readonly channelId?: string;
  view: string;
}

const viewers = new Map<string, Viewer>();

function uniqueUsers(select: (viewer: Viewer) => boolean): number {
  const userIds = new Set<string>();
  for (const viewer of viewers.values()) {
    if (select(viewer)) userIds.add(viewer.userId);
  }
  return userIds.size;
}

function publishAudience(): void {
  const globalUsers = uniqueUsers(() => true);
  const homeViewers = uniqueUsers((viewer) => viewer.view === "home");

  for (const viewer of viewers.values()) {
    const channelUsers = viewer.channelId === undefined
      ? 0
      : uniqueUsers((candidate) => candidate.channelId === viewer.channelId);
    viewer.client.emit("audience", {
      globalUsers,
      homeViewers,
      channelUsers,
      channelId: viewer.channelId ?? null,
    });
  }
}

export default defineWS({
  connect(client) {
    viewers.set(client.id, {
      client,
      userId: client.ludicord.user.id,
      channelId: client.ludicord.channelId,
      view: "home",
    });
    publishAudience();
  },
  events: {
    view(client, data) {
      const viewer = viewers.get(client.id);
      if (viewer === undefined || typeof data !== "object" || data === null) return;
      const path = (data as { readonly path?: unknown }).path;
      if (typeof path !== "string" || path.length > 128) return;
      viewer.view = path.replace(/^\/+|\/+$/g, "") || "home";
      publishAudience();
    },
  },
  disconnect(client) {
    viewers.delete(client.id);
    publishAudience();
  },
});
