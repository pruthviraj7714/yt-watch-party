"use client";

import type React from "react";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IChat } from "../types/type";

interface ChatPanelProps {
  messages: IChat[];
  onMessageSend: (message: string) => void;
}

export function ChatPanel({ messages, onMessageSend }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  return (
    <Card className="flex flex-col h-[calc(100vh-250px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{message.user.username}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm">{message.msg}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onMessageSend(newMessage);
            setNewMessage("");
          }}
          className="flex gap-2"
        >
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
