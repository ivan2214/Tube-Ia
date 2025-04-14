import type { TimelineEntry } from "@/entities/timeline/types";
import { TimelineEntryItem } from "./video-timeline-entry-item";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { motion } from "framer-motion";

interface VideoTimelineProps {
  timeline?: TimelineEntry[] | null;
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
  if (!timeline) {
    return null;
  }

  const isActive = (entry: TimelineEntry): boolean => {
    const nextEntryIndex = timeline.findIndex((t) => t.time > entry.time);
    const nextEntryTime =
      nextEntryIndex !== -1
        ? timeline[nextEntryIndex].time
        : Number.POSITIVE_INFINITY;

    return currentTime >= entry.time && currentTime < nextEntryTime;
  };

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className={compact ? "space-y-2" : "space-y-4 p-8"}>
        {timeline.map((entry) => (
          <motion.div
            key={`${entry.time}-${entry.title}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            <TimelineEntryItem
              entry={entry}
              isActive={isActive(entry)}
              onClick={onTimeClick}
              compact={compact}
            />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
