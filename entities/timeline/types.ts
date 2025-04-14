import type { Timeline } from "@/prisma/generated";

export type TimelineEntry = Omit<
  Timeline,
  "createdAt" | "updatedAt" | "videoId" | "id"
>;
