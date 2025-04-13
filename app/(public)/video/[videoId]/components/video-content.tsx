"use client";

import { useEffect, useState } from "react";
import { VideoPlayer } from "@/entities/video/components/video-player";
import { VideoTimeline } from "@/entities/video/components/video-timeline";
import { VideoChat } from "@/entities/video/components/video-chat";
import { generateVideoTimeline } from "@/entities/timeline/actions/timeline-actions";
import { saveToHistory } from "@/entities/history/actions/history-action";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { TimelineEntry } from "@/entities/timeline/types";
import { toast } from "sonner";
import { readStreamableValue } from "ai/rsc";

interface VideoContentProps {
  videoId: string;
}

export const VideoContent: React.FC<VideoContentProps> = ({ videoId }) => {
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        const { object, error, title } = await generateVideoTimeline(videoId);

        if (error || !object) {
          toast.error("Error", {
            description: "Failed to generate timeline. Please try again.",
          });
          return;
        }

        for await (const partialObject of readStreamableValue(object)) {
          if (partialObject.timeline) {
            setIsLoading(false);
            setVideoTitle(partialObject.title);
            setTimeline(partialObject.timeline);
          }
        }

        // Save to history
        await saveToHistory({
          videoId,
          title,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        toast.error("Error", {
          description: "Failed to generate timeline. Please try again.",
        });
      }
    };

    fetchTimeline();
  }, [videoId, toast]);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleTimelineClick = (time: number) => {
    setCurrentTime(time);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="mb-2 h-10 w-3/4" />
        ) : (
          <h1 className="font-bold text-2xl">{videoTitle}</h1>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoPlayer
            videoId={videoId}
            currentTime={currentTime}
            onTimeUpdate={handleTimeUpdate}
          />

          <div className="mt-6">
            <Tabs defaultValue="timeline">
              <TabsList className="w-full">
                <TabsTrigger value="timeline" className="flex-1">
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i.toString()} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <VideoTimeline
                    timeline={timeline}
                    currentTime={currentTime}
                    onTimeClick={handleTimelineClick}
                  />
                )}
              </TabsContent>
              <TabsContent value="chat" className="mt-4">
                <VideoChat
                  videoId={videoId}
                  videoTitle={videoTitle}
                  timeline={timeline}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 font-semibold text-lg">Video Timeline</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i.toString()} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <VideoTimeline
                timeline={timeline}
                currentTime={currentTime}
                onTimeClick={handleTimelineClick}
                compact
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
