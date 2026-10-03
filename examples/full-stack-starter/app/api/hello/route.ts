import type { LudicordRequest } from "ludicord/server";

export function GET(request: LudicordRequest) {
  const name = request.ludicord?.user.displayName ?? "player";
  return Response.json({
    message: "Hello, " + name + "!",
    serverTime: new Date().toISOString(),
  });
}
