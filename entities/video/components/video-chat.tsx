"use client";

import { useEffect, useRef } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { MemoizedMarkdown } from "@/shared/components/memoized-markdown";
import { VideoMessageInput } from "./video-message-input";

import { type Message, useChat } from "@ai-sdk/react";
import type { VideoWithRelations } from "../actions/video-db";
import type { NewVideo } from "@/app/(public)/video/[videoId]/components/video-content";

interface VideoChatProps {
  video: (VideoWithRelations | NewVideo) | null;
  chatId?: string | null;
  initialMessages?: Message[];
}

export function VideoChat({
  video,
  chatId,
  initialMessages = [],
}: VideoChatProps) {
  const { title: videoTitle, timeline, id: videoId } = video || {};

  const { messages } = useChat({
    id: chatId || "chat",
    initialMessages:
      initialMessages.length > 0
        ? initialMessages
        : [
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
    <div className="flex h-[60vh] flex-col rounded-lg border">
      <ScrollArea className="flex-1 p-4">
        <div className="max-h-[200px] space-y-4">
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
                      : "bg-gray-800"
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
        <VideoMessageInput timeline={timeline} videoId={videoId} />
      </div>
    </div>
  );
}
