import { useDiscordUser } from "ludicord/discord";
import { formatUserName } from "@/lib/format-user";

export default function embed() {
  const user = useDiscordUser();

  return (
    <main className="activity-main">
      <section className="activity-profile-card">
        <div className="activity-profile-hero">
          <span className="activity-eyebrow">Discord identity / verified context</span>
          <div className="activity-profile-identity">
            {user?.avatar ? <img className="activity-profile-avatar" src={user.avatar} alt="" /> : <span className="activity-profile-avatar activity-profile-avatar-fallback">?</span>}
            <div><h1 className="activity-profile-title">{user ? formatUserName(user) : "Browser guest"}</h1><p className="activity-profile-handle">{user ? "@" + user.username : "Connect through Discord to load your identity"}</p></div>
          </div>
        </div>
        <div className="activity-details">
          <div className="activity-detail"><span className="activity-detail-label">Connection</span><span className="activity-detail-value">{user ? "Authenticated by Ludicord" : "Local browser preview"}</span></div>
          <div className="activity-detail"><span className="activity-detail-label">Display name</span><span className="activity-detail-value">{user ? formatUserName(user) : "Unavailable outside Discord"}</span></div>
          <div className="activity-detail"><span className="activity-detail-label">User ID</span><span className="activity-detail-value">{user?.id ?? "Not provided in browser preview"}</span></div>
        </div>
      </section>
    </main>
  );
}
