import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { TimelineEntry } from "@/schemas/video";

interface TimelineProps {
  entries: TimelineEntry[];
  videoId: string;
}

export default function Timeline({ entries, videoId }: TimelineProps) {
  if (!entries || entries.length === 0) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const createYouTubeLink = (videoId: string, timestamp: number): string => {
    // Extract video ID if full URL was passed
    const id =
      videoId.includes("youtube.com") || videoId.includes("youtu.be")
        ? videoId.match(
            /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          )?.[1]
        : videoId;

    return `https://www.youtube.com/watch?v=${id}&t=${timestamp}s`;
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 font-bold text-xl">Video Timeline</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.timestamp}
              className="relative border-primary border-l-2 pl-4"
            >
              <div className="-left-[7px] absolute top-1 h-3 w-3 rounded-full bg-primary" />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {formatTime(entry.timestamp)}
                </Badge>
                <a
                  href={createYouTubeLink(videoId, entry.timestamp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <p className="mt-2">{entry.topic}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
