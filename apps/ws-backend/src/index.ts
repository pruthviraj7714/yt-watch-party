import { WebSocketServer } from "ws";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "dotenv";
import partyManager from "./partyManager";
config();

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

const checkUserAuthenticationAndGetUserId = (token: string) => {
  try {
    const user = verify(token, NEXTAUTH_SECRET!) as JwtPayload;
    return user.id;
  } catch (error: any) {
    console.error(error.message);
  }
};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, req) {
  ws.on("error", console.error);
  const url = req.url;

  if (!url) {
    console.error("URL is missing");
  }

  const userId = checkUserAuthenticationAndGetUserId(url?.split("?token=")[1]!);

  ws.on("message", function message(data: string) {
    const payload = JSON.parse(data);
    console.log(payload);

    switch (payload.type) {
      case "JOIN_PARTY":
        partyManager.joinParty(
          payload.partyId,
          userId,
          ws,
          payload.username,
          payload.hostId
        );
        break;
      case "LEAVE_PARTY":
        partyManager.leaveParty(payload.partyId, userId, ws);
        break;

      case "SEND_MESSAGE":
        partyManager.sendMessage(payload.partyId, userId, ws, payload.message);
        break;

      case "PAUSE_PARTY":
        partyManager.pauseParty(payload.partyId, userId, ws);
        break;

      case "PLAY_PARTY":
        partyManager.playParty(payload.partyId, userId, ws);
        break;

      case "CHANGE_TIMESTAMP":
        partyManager.changeTimestamp(
          payload.partyId,
          userId,
          ws,
          payload.newTimestamp
        );
        break;

      case "CLOSE_PARTY":
        partyManager.closeParty(payload.partyId, userId, ws);
        break;
    }
  });
});
