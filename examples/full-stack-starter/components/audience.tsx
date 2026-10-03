import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useEmbedPath } from "ludicord/navigation";
import { useWS } from "ludicord/ws/client";
import type { LudicordWSStatus } from "ludicord/ws/client";

interface AudienceSnapshot {
  readonly globalUsers: number;
  readonly homeViewers: number;
  readonly channelUsers: number;
  readonly channelId: string | null;
}

interface AudienceValue extends AudienceSnapshot {
  readonly status: LudicordWSStatus;
}

const emptyAudience: AudienceSnapshot = {
  globalUsers: 0,
  homeViewers: 0,
  channelUsers: 0,
  channelId: null,
};

const AudienceContext = createContext<AudienceValue | null>(null);

function isAudienceSnapshot(value: unknown): value is AudienceSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Partial<AudienceSnapshot>;
  return Number.isSafeInteger(data.globalUsers) &&
    Number.isSafeInteger(data.homeViewers) &&
    Number.isSafeInteger(data.channelUsers) &&
    (typeof data.channelId === "string" || data.channelId === null);
}

export function AudienceProvider({ children }: { readonly children: ReactNode }) {
  const path = useEmbedPath();
  const connection = useWS("/ws/audience");
  const [audience, setAudience] = useState<AudienceSnapshot>(emptyAudience);

  useEffect(() => connection.on("audience", (data) => {
    if (isAudienceSnapshot(data)) setAudience(data);
  }), [connection]);

  useEffect(() => {
    if (connection.status === "open") connection.emit("view", { path });
  }, [connection, connection.status, path]);

  const value = useMemo(
    () => ({ ...audience, status: connection.status }),
    [audience, connection.status],
  );

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience(): AudienceValue {
  const value = useContext(AudienceContext);
  if (value === null) throw new Error("useAudience must be used inside AudienceProvider.");
  return value;
}
