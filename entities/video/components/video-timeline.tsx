import { TimelineEntryItem } from "./video-timeline-entry-item";
import type { TimelineEntry } from "@/entities/timeline/types";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { motion } from "framer-motion";

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
  const isActive = (entry: TimelineEntry): boolean => {
    const nextEntryIndex = timeline.findIndex((t) => t.time > entry.time);
    const nextEntryTime =
      nextEntryIndex !== -1
        ? timeline[nextEntryIndex].time
        : Number.POSITIVE_INFINITY;

    return currentTime >= entry.time && currentTime < nextEntryTime;
  };

  const Wrapper = compact ? ScrollArea : "div";
  const wrapperClassName = compact ? "h-[calc(100vh-300px)]" : "space-y-4";

  return (
    <Wrapper className={wrapperClassName}>
      <div className={compact ? "space-y-2" : ""}>
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
    </Wrapper>
  );
}
