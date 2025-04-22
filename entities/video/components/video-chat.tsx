"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";

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
import type { NewVideo } from "@/entities/video/components/video-content";
import { generateId } from "ai";
import { cn } from "@/shared/lib/utils";
import type { User } from "@/prisma/generated";

interface VideoChatProps {
  video: (VideoWithRelations | NewVideo) | null;
  chatId?: string | null;
  initialMessages?: Message[];
  currentUser: User;
}

export function VideoChat({
  video,
  chatId,
  initialMessages = [],
  currentUser,
}: VideoChatProps) {
  const { title: videoTitle, timeline, id: videoId } = video || {};

  const idChat = chatId || generateId();

  const { messages } = useChat({
    id: idChat,
    api: "/api/chat",
    experimental_throttle: 50,
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

  // Memoizar el scroll al final de los mensajes
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Get initials from first and last name separated by space
  const getInitials = useCallback((name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, []);

  // Memoizar la lista de mensajes para evitar renderizados innecesarios
  const messageElements = useMemo(() => {
    return messages.map((message) => (
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
            className={cn(
              "max-w-sm p-3",
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "dark:bg-gray-800"
            )}
          >
            <div className="prose space-y-2">
              <MemoizedMarkdown id={message.id} content={message.content} />
            </div>
          </Card>
          {message.role === "user" && (
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarFallback>
                {getInitials(currentUser.name || "")}
              </AvatarFallback>

              <AvatarImage src={currentUser.image || ""} />
            </Avatar>
          )}
        </div>
      </div>
    ));
  }, [messages]);

  return (
    <div className="flex h-[60vh] flex-col rounded-lg border">
      <ScrollArea className="flex-1 p-4">
        <div className="max-h-[200px] space-y-4">
          {messageElements}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <VideoMessageInput
          messages={messages}
          chatId={idChat}
          timeline={timeline}
          videoId={videoId}
        />
      </div>
    </div>
  );
}
