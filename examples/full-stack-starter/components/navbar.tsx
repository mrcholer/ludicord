import { useDiscordUser } from "ludicord/discord";
import { Link, useEmbedPath } from "ludicord/navigation";

export default function Navbar() {
  const user = useDiscordUser();
  const path = useEmbedPath();

  return (
    <nav
      aria-label="Main navigation"
      className="activity-nav"
    >
      <div className="activity-brand">
        <span className="activity-brand-mark" aria-hidden="true"><span className="activity-brand-orb" /></span>
        <span className="activity-brand-copy">
          <span className="activity-brand-name">Activity canvas</span>
          <span className="activity-brand-meta">Powered by Ludicord</span>
        </span>
      </div>
      <div className="activity-nav-links">
        <Link className={"activity-nav-button" + (path === "home" ? " " + "activity-nav-active" : "")} href="home">Home</Link>
        <Link className={"activity-nav-button" + (path === "me" ? " " + "activity-nav-active" : "")} href="me">Profile</Link>
      </div>
      <div className="activity-profile" aria-label={user ? "Logged in as " + user.displayName : "Not logged in"}>
        {user?.avatar ? (
          <img className="activity-avatar" src={user.avatar} alt="" />
        ) : (
          <span className="activity-avatar activity-avatar-fallback">?</span>
        )}
        <span className="activity-profile-name">{user?.displayName ?? "Preview"}</span>
        <span className={"activity-profile-status " + (user ? "activity-online" : "activity-guest")} aria-hidden="true" />
      </div>
    </nav>
  );
}
