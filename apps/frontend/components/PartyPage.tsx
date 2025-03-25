"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "./video-player";
import { ChatPanel } from "./chat-panel";
import { useSocket } from "../hooks/useSocket";
import { toast } from "sonner";
import { useEffect } from "react";
import { IParty } from "../types/type";

export default function PartyPageComponent({
  party,
  videoId,
}: {
  party: IParty;
  videoId: string;
}) {
  const { socket, wsError } = useSocket();

  if (wsError) {
    toast.error("Error while connection to websocket", {
      description: wsError,
    });
  }

  useEffect(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "JOIN_PARTY",
        partyId: party.id,
      })
    );

    socket.onmessage = ({ data }) => {
      const payload = JSON.parse(data);
      console.log(payload);

      switch (payload.type) {
        case "PARTY_JOINED":
          console.log("someone joined party");
          break;
        case "LEFT_PARTY":
          console.log("someone left party");
        case "TIMESTAMP_CHANGED":
          console.log("Timestamp changed");
          break;
        case "PARTY_CLOSED":
          console.log("party closed");
          break;
      }
    };

    return () => {
      socket.send(
        JSON.stringify({
          type: "LEAVE_PARTY",
          partyId: party.id,
        })
      );
    };
  }, [socket]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/home"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Link>
          <h1 className="text-2xl font-bold">{party.slug}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{party.participants.length} watching</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer videoId={videoId} />
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
                Participants ({party.participants.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-4">
              <ChatPanel partyId={party.id} />
            </TabsContent>
            <TabsContent value="participants" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {Array.from({ length: party.participants.length }).map(
                    (_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">U{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">User {i + 1}</p>
                          {i === 0 && (
                            <p className="text-xs text-muted-foreground">
                              Host
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
