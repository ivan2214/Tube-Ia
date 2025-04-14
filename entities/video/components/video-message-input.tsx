"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { type Message, useChat } from "@ai-sdk/react";

import { Loader, Send } from "lucide-react";

import type { TimelineEntry } from "@/entities/timeline/types";
import { saveChat } from "@/entities/chat/actions/chat-actions";
import { generateId } from "ai";

export const VideoMessageInput = ({
  videoId,
  timeline,
  chatId,
  messages,
}: {
  videoId?: string;
  timeline?: TimelineEntry[] | null;
  chatId: string;
  messages: Message[];
}) => {
  const { input, handleSubmit, handleInputChange, isLoading } = useChat({
    id: chatId,
    api: "/api/chat",
    body: {
      videoId,
      timeline,
    },
    experimental_throttle: 50,
    onFinish: async (message) => {
      // Get all existing messages
      const oldMessages = messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }));

      // Create a user message with the current input
      const userMessage = {
        id: `msg-${generateId()}`,
        role: "user" as const,
        content: input,
      };

      // Create the AI response message
      const aiMessage = {
        id: message.id,
        role: message.role,
        content: message.content,
      };

      // Combine all messages, ensuring both user input and AI response are included
      const newMessages = [...oldMessages, userMessage, aiMessage];

      await saveChat({
        messages: newMessages,
        videoId,
        chatId,
      });
    },
  });
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Hablar sobre el video..."
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
