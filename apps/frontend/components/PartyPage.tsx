"use client";

import { ArrowLeft, MessageSquare, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "./video-player";
import { ChatPanel } from "./chat-panel";
import { useSocket } from "../hooks/useSocket";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { IChat, IParticipant, IParty } from "../types/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PartyPageComponent({
  party,
  videoId,
}: {
  party: IParty;
  videoId: string;
}) {
  const { socket, wsError } = useSocket();
  const [participants, setParticipants] = useState<IParticipant[]>(
    party.participants
  );
  const [chats, setChats] = useState<IChat[]>(party.chats);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    party.currentTimestamp
  );
  const [videoPlayStatus, setVideoPlayStatus] = useState(party.isPlaying);
  const { data: session } = useSession();
  const router = useRouter();

  if (wsError) {
    toast.error("Error while connection to websocket", {
      description: wsError,
    });
  }

  const handleLeaveRoom = () => {
    if (!socket) return;
    socket?.send(
      JSON.stringify({
        type: "LEAVE_PARTY",
        userId: session?.user.id,
        partyId: party.id,
      })
    );
    socket.close();
  };

  const handleSendMessage = (newMessage: string) => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "SEND_MESSAGE",
        userId: session?.user.id,
        message: newMessage,
        partyId: party.id,
      })
    );
  };

  const handleCloseParty = () => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "CLOSE_PARTY",
        userId: session?.user.id,
        partyId: party.id,
      })
    );
  };

  const handlePauseParty = () => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "PAUSE_PARTY",
        userId: session?.user.id,
        partyId: party.id,
      })
    );
  };

  const handlePlayParty = () => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "PLAY_PARTY",
        userId: session?.user.id,
        partyId: party.id,
      })
    );
  };

  const handleChangeTimestamp = (newTimestamp: number) => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "CHANGE_TIMESTAMP",
        userId: session?.user.id,
        partyId: party.id,
        newTimestamp: newTimestamp,
      })
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "JOIN_PARTY",
        partyId: party.id,
        hostId: party.hostId,
        username: session?.user.name,
      })
    );

    socket.onmessage = ({ data }) => {
      const payload = JSON.parse(data);
      console.log(payload);

      switch (payload.type) {
        case "PARTY_JOINED":
          if (party.id === payload.partyId) {
            setParticipants((prev) => [...prev, payload.participant]);
            if (payload.userId !== session?.user.id) {
              toast(`${payload.username} joined party!`);
            }
          }
          break;
        case "PARTY_LEFT":
          if (party.id === payload.partyId) {
            setParticipants((prev) =>
              prev.filter((p) => p.participantId !== payload.userId)
            );
            if (payload.userId !== session?.user.id) {
              toast(`${payload.username} left party!`);
            }
          }
          break;
        case "TIMESTAMP_CHANGED":
          setCurrentTimestamp(payload.newTimestamp);
          break;

        case "PARTY_PAUSED":
          setVideoPlayStatus(false);
          if (session?.user.id !== party.hostId) {
            toast("Host paused the party");
          }
          break;

        case "PARTY_PLAYED":
          setVideoPlayStatus(true);
          if (session?.user.id !== party.hostId) {
            toast.success("Host played the party");
          }
          break;

        case "PARTY_CLOSED":
          if (payload.partyId === party.id) {
            if (session?.user?.id && session.user.id === party.hostId) {
              toast.success("You have successfully closed the party.");
            } else {
              toast.success("The host has closed the party.");
            }
            router.push("/home");
          }
          break;
        case "MESSAGE_RECIEVED":
          setChats((prev) => [...prev, payload.msg]);
          break;
        case "ERROR":
          toast.error(payload.error);
      }
    };

    return () => {
      handleLeaveRoom();
    };
  }, [socket, party]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            onClick={() => {
              handleLeaveRoom();
              router.push("/home");
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </div>
          <h1 className="text-2xl font-bold">{party.slug}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{participants.length} watching</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer
            videoId={videoId}
            hostId={party.hostId}
            partyId={party.id}
            currentTimestamp={currentTimestamp}
            onPause={handlePauseParty}
            onPlay={handlePlayParty}
            onTimeChange={handleChangeTimestamp}
            isPlaying={videoPlayStatus}
          />

          <div className="mt-4">
            {session?.user.id === party.hostId && (
              <Button variant={"destructive"} onClick={handleCloseParty}>
                Close Party
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Tabs defaultValue="chat">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                Participants ({participants.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-4">
              <ChatPanel messages={chats} onMessageSend={handleSendMessage} />
            </TabsContent>
            <TabsContent value="participants" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {p.participant.username[0]!.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {p.participant.username}
                        </p>
                        {p.participantId === party.hostId && (
                          <p className="text-xs text-muted-foreground">Host</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
