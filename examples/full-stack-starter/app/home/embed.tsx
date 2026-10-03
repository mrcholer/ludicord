import { useActivityQuery } from "ludicord/activity";
import {
  useActivityInstance,
  useDiscordUser,
  useParticipants,
} from "ludicord/discord";
import { Link } from "ludicord/navigation";
import { useAudience } from "@/components/audience";

interface GreetingResponse {
  readonly message: string;
  readonly serverTime: string;
}

export default function embed() {
  const user = useDiscordUser();
  const activity = useActivityInstance();
  const participants = useParticipants();
  const audience = useAudience();
  const greeting = useActivityQuery<GreetingResponse>(
    "starter-greeting",
    async ({ signal }) => {
      const response = await fetch("/api/hello", { signal });
      if (!response.ok) throw new Error("The starter API did not respond.");
      return response.json() as Promise<GreetingResponse>;
    },
    { staleTime: 30_000 },
  );

  return (
    <main className="activity-main">
      <section className="activity-hero">
        <div className="activity-hero-glow" />
        <div className="activity-hero-top">
          <span className="activity-eyebrow">Ludicord starter / live canvas</span>
          <span className="activity-live">
            <span className="activity-live-dot" />
            {audience.status === "open" ? "Realtime connected" : "Opening realtime"}
          </span>
        </div>
        <h1 className="activity-title">
          Your Activity starts here{user ? ", " + user.displayName : ""}.
        </h1>
        <p className="activity-copy">
          A production-shaped Discord canvas with authenticated data, typed embeds, a server route, and realtime presence already connected.
        </p>
        <div className="activity-actions">
          <Link className="activity-action activity-action-primary" href="me">View your profile</Link>
          <a className="activity-action activity-action-secondary" href="https://github.com/mrcholer/ludicord/blob/main/docs/README.md" target="_blank" rel="noreferrer">Read the framework guide ↗</a>
        </div>
      </section>

      <div className="activity-cards">
        <article className={"activity-card" + " " + "activity-card-wide"}>
          <div className="activity-card-head">
            <strong className="activity-card-title">Runtime topology</strong>
            <span className="activity-card-meta">{activity.instanceId ? "Discord instance" : "Browser preview"}</span>
          </div>
          <div className="activity-diagram" aria-label="Client, Discord, and server are connected">
            <span className={"activity-node" + " " + "activity-node-accent"}>01</span>
            <span className="activity-line" />
            <span className="activity-node">02</span>
            <span className="activity-line" />
            <span className="activity-node">03</span>
          </div>
          <span className="activity-card-copy">Client → Discord context → Ludicord server</span>
        </article>
        <article className="activity-card">
          <div className="activity-card-head"><strong className="activity-card-title">Participants</strong><span className="activity-card-meta">This instance</span></div>
          <span className="activity-metric">{participants.length}</span>
          <span className="activity-card-copy">Discord participants available to the current Activity.</span>
        </article>
        <article className="activity-card">
          <div className="activity-card-head"><strong className="activity-card-title">Audience</strong><span className="activity-card-meta">All sessions</span></div>
          <span className="activity-metric">{audience.status === "open" ? audience.globalUsers : "—"}</span>
          <span className="activity-card-copy">Unique users connected to this server process.</span>
        </article>
        <article className="activity-card">
          <div className="activity-card-head"><strong className="activity-card-title">Home</strong><span className="activity-card-meta">Current embed</span></div>
          <span className="activity-metric">{audience.status === "open" ? audience.homeViewers : "—"}</span>
          <span className="activity-card-copy">People viewing this internal screen right now.</span>
        </article>
        <article className="activity-card">
          <div className="activity-card-head"><strong className="activity-card-title">Channel</strong><span className="activity-card-meta">{audience.channelId ? "Discord scoped" : "No channel"}</span></div>
          <span className="activity-metric">{audience.status === "open" && audience.channelId ? audience.channelUsers : "—"}</span>
          <span className="activity-card-copy">Presence isolated to the current Discord channel.</span>
        </article>
        <article className={"activity-card" + " " + "activity-card-wide"}>
          <div className="activity-card-head"><strong className="activity-card-title">Server response</strong><span className="activity-card-meta">/api/hello</span></div>
          <span className="activity-metric">{greeting.status === "error" ? "Offline" : greeting.data ? "Ready" : "Loading"}</span>
          <span className="activity-card-copy">{greeting.data?.message ?? (greeting.status === "error" ? "The example route could not respond." : "Requesting authenticated server data…")}</span>
        </article>
      </div>

      <section className="activity-section">
        <div className="activity-section-head">
          <div><span className="activity-eyebrow">Make it yours</span><h2 className="activity-section-title">Three clean extension points.</h2></div>
          <p className="activity-section-copy">Keep the shell mounted, add focused embed screens, and move trusted work into server routes. The starter demonstrates each boundary without choosing your product for you.</p>
        </div>
        <div className="activity-steps">
          <div className="activity-step"><span className="activity-step-number">01 / interface</span><strong className="activity-step-title">Shape the Home embed</strong><span className="activity-step-copy">Replace this canvas with the experience your Activity needs.</span><code className="activity-code">app/home/embed.tsx</code></div>
          <div className="activity-step"><span className="activity-step-number">02 / server</span><strong className="activity-step-title">Add trusted behavior</strong><span className="activity-step-copy">Keep secrets and authoritative data in API or WebSocket routes.</span><code className="activity-code">app/api/**/route.ts</code></div>
          <div className="activity-step"><span className="activity-step-number">03 / ship</span><strong className="activity-step-title">Validate the production graph</strong><span className="activity-step-copy">Compile client and server boundaries before deployment.</span><code className="activity-code">npm run build</code></div>
        </div>
      </section>
    </main>
  );
}
