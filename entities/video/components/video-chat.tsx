"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { TimelineEntry } from "@/entities/timeline/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Loader, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { MemoizedMarkdown } from "@/shared/components/memoized-markdown";

interface VideoChatProps {
  videoId: string;
  videoTitle: string;
  timeline: TimelineEntry[];
}

export function VideoChat({ videoId, videoTitle, timeline }: VideoChatProps) {
  const { messages } = useChat({
    id: "chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: `¡Hola! Soy tu asistente de IA para "${videoTitle}". Pregúntame cualquier cosa sobre este video y te ayudaré a entender mejor su contenido.`,
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div className="flex h-[60vh] flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-[80%] items-start gap-3">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  </Avatar>
                )}
                <Card
                  className={`p-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="prose space-y-2">
                    <MemoizedMarkdown
                      id={message.id}
                      content={message.content}
                    />
                  </div>
                </Card>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <MessageInput timeline={timeline} videoId={videoId} />
      </div>
    </div>
  );
}

const MessageInput = ({
  videoId,
  timeline,
}: {
  videoId: string;
  timeline: TimelineEntry[];
}) => {
  const { input, handleSubmit, handleInputChange, isLoading } = useChat({
    id: "chat",
    api: "/api/chat",
    body: {
      videoId,
      timeline,
    },
  });
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Ask about the video..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !input.trim()}>
        {isLoading ? (
          <Loader className="h-5 w-5" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};
