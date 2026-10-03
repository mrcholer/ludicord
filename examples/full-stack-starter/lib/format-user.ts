import type { LudicordDiscordUser } from "ludicord/discord";

export function formatUserName(user: LudicordDiscordUser): string {
  return user.displayName || user.username;
}
