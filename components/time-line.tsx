"use client";

import type React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import type { TimelineEntry } from "@/schemas/video";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TimelineProps {
  entries: TimelineEntry[];
  onTimeClick?: (seconds: number) => void;
  currentTime?: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Timeline({
  entries,
  onTimeClick,
  currentTime = 0,
  containerRef,
}: TimelineProps) {
  if (!entries || entries.length === 0) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Sort entries by timestamp
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  // Find the current section based on currentTime
  const currentSection = sortedEntries.reduce(
    (prev, current, index, array) => {
      // Check if current time is between this timestamp and the next one
      const nextTimestamp =
        index < array.length - 1
          ? array[index + 1].timestamp
          : Number.POSITIVE_INFINITY;
      if (current.timestamp <= currentTime && currentTime < nextTimestamp) {
        return current;
      }
      return prev;
    },
    { timestamp: -1, topic: "", description: "" }
  );

  return (
    <Card className="p-6">
      <h2 className="mb-4 font-bold text-xl">Video Timeline</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div ref={containerRef} className="space-y-6">
          {sortedEntries.map((entry) => {
            const isCurrentSection =
              currentSection.timestamp === entry.timestamp;

            return (
              <div
                key={entry.timestamp}
                className={`relative border-l-2 pl-4 ${
                  isCurrentSection ? "border-primary" : "border-gray-200"
                }`}
              >
                <div
                  className={`-left-[7px] absolute top-1 h-3 w-3 rounded-full ${
                    isCurrentSection ? "bg-primary" : "bg-gray-200"
                  }`}
                />
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isCurrentSection ? "default" : "outline"}
                    className="font-mono"
                  >
                    {formatTime(entry.timestamp)}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onTimeClick?.(entry.timestamp)}
                    title={`Play from ${formatTime(entry.timestamp)}`}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value={`item-${entry.timestamp}`}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={
                        isCurrentSection ? "font-medium text-primary" : ""
                      }
                    >
                      {entry.topic}
                    </AccordionTrigger>
                    <AccordionContent>{entry.description}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
