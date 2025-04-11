"use client";

import type React from "react";

import { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { Bot, Send, User } from "lucide-react";
import { useVideoStore } from "@/entities/video/store/video-store";
import { useChat } from "@ai-sdk/react";
import { MemoizedMarkdown } from "../../../shared/components/memoized-markdown";
import { cn } from "@/shared/lib/utils";

// Suggested initial questions for the chatbot
const SUGGESTED_QUESTIONS = [
  "¿Puedes resumir este video para mí?",
  "¿Cuáles son los puntos principales discutidos en este video?",
  "Explica el tema en el minuto 5 con más detalle.",
  "¿Cuál es la conclusión más importante de este video?",
];

export default function ChatInterface() {
  const { videoId, transcript, videoTitle } = useVideoStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    experimental_throttle: 50,
    body: {
      videoId,
      transcript,
      videoTitle,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm your AI assistant for "${videoTitle}". Ask me anything about the video content, and I'll try to help you understand it better.`,
      },
    ],
  });

  // Auto-scroll to bottom when messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    // Set the input value and submit the form
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>);
    setTimeout(() => handleSubmit(fakeEvent), 100);
  };

  return (
    <Card className="flex shadow-lg">
      <CardHeader className="flex items-center border-b">
        <Bot className="h-6 w-6" />
        <h3 className="ml-2 font-medium text-lg">Asistente de video</h3>
      </CardHeader>

      <CardContent>
        <ScrollArea className=" flex-1 p-4">
          <div className="max-h-[500px] space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    "flex items-center space-x-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "user" ? (
                    <p>
                      <Bot className="h-4 w-4" />
                      <span className="text-muted-foreground text-xs">
                        Asistente
                      </span>
                    </p>
                  ) : (
                    <p>
                      <User className="h-4 w-4" />
                      <span className="text-muted-foreground text-xs">Tú</span>
                    </p>
                  )}
                </div>
                <div className="prose space-y-2">
                  <MemoizedMarkdown id={message.id} content={message.content} />
                </div>
              </div>
            ))}

            {/* Suggested questions when only the welcome message is present */}
            {messages.length === 1 && (
              <div className="mt-4 space-y-2">
                <p className="text-muted-foreground text-sm">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuestionClick(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full border-t pt-4">
          <div className="flex gap-2">
            <Input
              name="prompt"
              placeholder="Ask about the video content..."
              value={input}
              onChange={handleInputChange}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
