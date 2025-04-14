"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useChat } from "@ai-sdk/react";

import { Loader, Send } from "lucide-react";

import type { TimelineEntry } from "@/entities/timeline/types";

export const VideoMessageInput = ({
  videoId,
  timeline,
}: {
  videoId?: string;
  timeline?: TimelineEntry[] | null;
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
