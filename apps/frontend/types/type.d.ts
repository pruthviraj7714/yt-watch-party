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
  id : string;
  participantId : string;
  partyId : string;
}