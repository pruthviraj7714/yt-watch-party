export interface IParty {
  id: string;
  slug: string;
  videoUrl: string;
  isPlaying: boolean;
  hostId: string;
  createdAt: Date;
  participants: any[];
  currentTimestamp: number;
  chats: any[];
}
