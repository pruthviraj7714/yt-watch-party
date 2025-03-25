"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "../hooks/useSocket";
import { useSession } from "next-auth/react";

interface ChatPanelProps {
  partyId: string;
}

const initialMessages = [
  {
    id: "1",
    user: "User 1",
    content: "Hey everyone! Ready to watch?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    user: "User 2",
    content: "Yes! I've been waiting for this video",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    user: "User 3",
    content: "The audio quality is really good",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "4",
    user: "User 1",
    content: "I agree! The presenter is great too",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "5",
    user: "User 4",
    content: "Can someone explain what they just said at 2:45?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
];

export function ChatPanel({ partyId }: ChatPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const { loading, wsError, socket } = useSocket();
  const { data: session } = useSession();

  useEffect(() => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "JOIN_PARTY",
        userId: session?.user.id,
        partyId: partyId,
      })
    );

    socket.onmessage = ({ data }: MessageEvent) => {
      const payload = JSON.parse(data);

      switch (payload.type) {
        case "PARTY_JOINED":
          console.log("JOINED Party");
          break;
      }
    };
  }, [loading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: "You",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-250px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{message.user}</span>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
