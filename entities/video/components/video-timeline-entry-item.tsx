import { memo } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatTime } from "@/shared/utils/format-time";
import type { TimelineEntry } from "@/entities/timeline/types";
import { cn } from "@/shared/lib/utils";

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
          className="group cursor-pointer rounded-md p-2 transition-colors duration-300"
          onClick={() => onClick(entry.time)}
          variant="ghost"
          size="sm"
        >
          <div
            className={cn(
              "flex items-center gap-2 group-hover:text-blue-500",
              isActive && "text-blue-500"
            )}
          >
            <Badge
              className={cn(
                "group-hover:text-blue-500",
                isActive && "text-blue-500"
              )}
              variant="outline"
            >
              {formatTime(entry.time)}
            </Badge>
            <h3 className="font-medium text-sm group-hover:text-blue-500">
              {entry.title}
            </h3>
          </div>
        </Button>
      );
    }

    return (
      <Card
        className={`group cursor-pointer transition-colors duration-300 hover:border-blue-500 ${
          isActive ? "border-blue-500 shadow-md" : "hover:shadow-md"
        }`}
        onClick={() => onClick(entry.time)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Badge className="mt-1 shrink-0 dark:group-hover:text-blue-500">
              {formatTime(entry.time)}
            </Badge>
            <div>
              <h3 className="mb-1 font-medium group-hover:text-blue-500">
                {entry.title}
              </h3>
              <p className="text-gray-600 text-sm group-hover:text-blue-500">
                {entry.description}
              </p>
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
