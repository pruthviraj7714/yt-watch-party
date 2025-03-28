import { prismaClient } from "@repo/db/client";
import { WebSocket } from "ws";

interface IParticipant {
  userId: string;
  ws: WebSocket;
}

interface IChat {
  id: string;
  userId: string;
  partyId: string;
  msg: string;
  createdAt: Date;
}


interface IParty {
  id: string;
  participants: IParticipant[];
  chats: any[];
}

class PartyManager {
  private static partyManagerInstance: PartyManager;
  private partyMap: Map<string, IParty> = new Map();

  private constructor() {}

  public static getInstance(): PartyManager {
    if (!this.partyManagerInstance) {
      this.partyManagerInstance = new PartyManager();
    }
    return this.partyManagerInstance;
  }

  private broadcastToParty(partyId: string, message: string) {
    const party = this.partyMap.get(partyId);
    if (party) {
      party.participants.forEach((participant) => {
        try {
          participant.ws.send(message);
        } catch (error) {
          console.error(
            `Error sending message to participant ${participant.userId}:`,
            error
          );
        }
      });
    }
  }

  public async joinParty(partyId: string, userId: string, ws: WebSocket) {
    const party = this.partyMap.get(partyId);

  if (!party) {
      let party = {
        id: partyId,
        chats: [],
        participants: [{ userId, ws }],
      };
      this.partyMap.set(partyId, party);
    } else if(party.participants.some(p => p.ws === ws)) {
      console.log("User alreday exists");
      return;
    } 
    else {
      party?.participants.push({ userId, ws });
    }

    try {
      const participant = await prismaClient.participant.create({
        data: {
          participantId: userId,
          partyId,
        },
        include : {
          participant : {
            select : {
              username : true
            }
          }
        }
      });
      this.broadcastToParty(
        partyId,
        JSON.stringify({
          type: "PARTY_JOINED",
          partyId,
          userId,
          participant,
        })
      );
    } catch (error: any) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          error: error.message,
        })
      );
    }
  }

  public async leaveParty(partyId: string, userId: string, ws: WebSocket) {
    try {
      const party = this.partyMap.get(partyId);

      if (!party) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            error: "Party does not exist",
          })
        );
        return;
      }

      const updatedParticipants = party.participants.filter(
        (p) => p.ws !== ws
      );
      this.partyMap.get(partyId)!.participants = updatedParticipants;

      if (updatedParticipants.length === 0) {
        this.partyMap.delete(partyId);
      }

      await prismaClient.participant.delete({
        where: {
          participantId_partyId: {
            participantId: userId,
            partyId,
          },
        },
      });

      this.broadcastToParty(
        partyId,
        JSON.stringify({
          type: "PARTY_LEFT",
          partyId,
          userId,
        })
      );
    } catch (error: any) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          error: error.message,
        })
      );
    }
  }

  public async sendMessage(partyId : string, userId : string, ws : WebSocket, message : string) {
    try {
      const party = this.partyMap.get(partyId);

      if (!party) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            error: "Party does not exist",
          })
        );
        return;
      }

      const msg = await prismaClient.chat.create({
        data : {
          partyId ,
          userId,
          msg : message,
        },
        include : {
          user : {
            select : {
              username : true
            }
          }
        }
      })

      this.partyMap.get(partyId)!.chats = [...party.chats, msg];

      this.broadcastToParty(
        partyId,
        JSON.stringify({
          type: "MESSAGE_RECIEVED",
          partyId,
          userId,
          msg
        })
      );
    } catch (error: any) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          error: error.message,
        })
      );
    }
    
  }

}

export default PartyManager.getInstance();
