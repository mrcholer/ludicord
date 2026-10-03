import { defineConfig } from "ludicord/config";

export default defineConfig({
  discord: {
    clientId: process.env.LUDICORD_DISCORD_CLIENT_ID,
    scopes: ["identify", "guilds"],
    auth: {
      required: true,
      session: "encrypted-cookie",
      proxyVerification: false,
      activityInstanceVerification: "auto",
    },
  },
  activity: {
    defaultEmbed: "home",
    outsideDiscord: "allow",
  },
  react: {
    strictMode: true,
  },
  build: {
    clientAssetWarningLimit: 512000,
  },
  imports: {
    aliases: {
      "@/components": "./components",
      "@/lib": "./lib",
      "@": ".",
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: true,
    limits: { body: "2mb" },
    requestTimeout: 30000,
    shutdownTimeout: 10000,
  },
  websocket: {
    enabled: true,
    heartbeatInterval: 30000,
    maxPayload: 262144,
    compression: false,
    maxMessagesPerSecond: 120,
    maxBytesPerSecond: 524288,
    backpressureLimit: 524288,
    backpressureStrategy: "queue-latest",
    maxQueuedMessages: 64,
    reconnect: {
      enabled: true,
      attempts: 10,
      initialDelay: 500,
      maxDelay: 10000,
    },
  },
});
