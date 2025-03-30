import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import { IChat } from "../types/type";

interface ChatPanelProps {
  messages: IChat[];
  onMessageSend: (message: string) => void;
  hostId: string;
}

export function ChatPanel({ messages, onMessageSend, hostId }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");

  return (
    <Card className="flex flex-col h-[calc(100vh-250px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isHost = message.userId === hostId;
            return (
              <div
                key={message.id}
                className={`flex items-start gap-3 group p-2 rounded-lg transition-colors ${
                  isHost
                    ? "bg-sky-100 text-sky-800 border border-sky-300 shadow-sm"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden border border-border flex-shrink-0 bg-muted flex items-center justify-center">
                  {message.user.image ? (
                    <img
                      src={message.user.image || "/placeholder.svg"}
                      alt={`${message.user.username}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {message.user.username.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col space-y-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-medium text-sm ${isHost ? "text-sky-800" : "text-foreground"}`}
                    >
                      {message.user.username} {isHost && "(Host)"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="text-sm max-w-full break-words">
                    {message.msg}
                  </div>
                </div>
              </div>
            );
          })}
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
