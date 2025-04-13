"use client";

import type { TimelineEntry } from "@/entities/timeline/types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Button } from "@/shared/components/ui/button";

interface VideoTimelineProps {
  timeline: TimelineEntry[];
  currentTime: number;
  onTimeClick: (time: number) => void;
  compact?: boolean;
}

export function VideoTimeline({
  timeline,
  currentTime,
  onTimeClick,
  compact = false,
}: VideoTimelineProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isActive = (entry: TimelineEntry): boolean => {
    const nextEntryIndex = timeline.findIndex((t) => t.time > entry.time);
    const nextEntryTime =
      nextEntryIndex !== -1
        ? timeline[nextEntryIndex].time
        : Number.POSITIVE_INFINITY;

    return currentTime >= entry.time && currentTime < nextEntryTime;
  };

  if (compact) {
    return (
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2">
          {timeline?.map((entry) => (
            <Button
              key={entry.time}
              className={`cursor-pointer rounded-md p-2 transition-colors ${
                isActive(entry)
                  ? "border-blue-500 border-l-4 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onTimeClick(entry.time)}
              variant="ghost"
              size="sm"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{formatTime(entry.time)}</Badge>
                <h3 className="font-medium text-sm">{entry.title}</h3>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((entry) => (
        <Card
          key={entry.time}
          className={`cursor-pointer transition-all ${
            isActive(entry) ? "border-blue-500 shadow-md" : "hover:shadow-md"
          }`}
          onClick={() => onTimeClick(entry.time)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge className="mt-1 shrink-0">{formatTime(entry.time)}</Badge>
              <div>
                <h3 className="mb-1 font-medium">{entry.title}</h3>
                <p className="text-gray-600 text-sm">{entry.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
