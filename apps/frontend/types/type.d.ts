export interface IParty {
  id: string;
  slug: string;
  videoUrl: string;
  isPlaying: boolean;
  hostId: string;
  createdAt: Date;
  participants: IParticipant[];
  currentTimestamp: number;
  chats: any[];
}

export interface IParticipant {
  id: string;
  participantId: string;
  participant : {
    username : string;
    image : string;
  }
  partyId: string;
}

export interface IChat {
  id: string;
  userId: string;
  user : {
    username : string;
    image : string;
  }
  partyId: string;
  msg: string;
  createdAt: Date;
}
