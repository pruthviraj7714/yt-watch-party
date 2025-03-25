import { WebSocketServer } from "ws";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "dotenv";
config();

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

const checkUserAuthenticationAndGetUserId = (token: string) => {
  try {
    const user = verify(token, NEXTAUTH_SECRET!) as JwtPayload;
    return user.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, req) {
  ws.on("error", console.error);
  const url = req.url;

  if (!url) {
    throw Error("URL is missing");
  }

  const userId = checkUserAuthenticationAndGetUserId(url?.split("?token=")[1]!);

  console.log(userId);
  

  ws.on("message", function message(data: string) {
    const payload = JSON.parse(data);
    console.log(payload);
    

    switch (payload.type) {
      case "JOIN_PARTY":
        console.log("party joined");
        break;
      case "LEAVE_PARTY":
        console.log("LEFT PARTY");
        break;

      case "SEND_MESSAGE":
        console.log("Message sent");
        break;

      case "CHANGE_TIMESTAMP":
        console.log("Timestamp changed");
        break;

      case "CLOSE_PARTY":
        console.log("PArty closed");
        break;
    }
  });

  ws.send("connected to websocket");
});
