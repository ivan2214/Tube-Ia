import { memo } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatTime } from "@/shared/utils/format-time";
import type { TimelineEntry } from "@/entities/timeline/types";

interface TimelineEntryItemProps {
  entry: TimelineEntry;
  isActive: boolean;
  onClick: (time: number) => void;
  compact: boolean;
}

export const TimelineEntryItem = memo(
  ({ entry, isActive, onClick, compact }: TimelineEntryItemProps) => {
    if (compact) {
      return (
        <Button
          className={`cursor-pointer rounded-md p-2 transition-colors ${
            isActive
              ? "border-blue-500 border-l-4 bg-blue-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onClick(entry.time)}
          variant="ghost"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline">{formatTime(entry.time)}</Badge>
            <h3 className="font-medium text-sm">{entry.title}</h3>
          </div>
        </Button>
      );
    }

    return (
      <Card
        className={`cursor-pointer transition-all ${
          isActive ? "border-blue-500 shadow-md" : "hover:shadow-md"
        }`}
        onClick={() => onClick(entry.time)}
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
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.entry.time === nextProps.entry.time &&
      prevProps.entry.title === nextProps.entry.title &&
      prevProps.entry.description === nextProps.entry.description &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.compact === nextProps.compact &&
      prevProps.onClick === nextProps.onClick
    );
  }
);

TimelineEntryItem.displayName = "TimelineEntryItem";
