import { z } from "zod";

// Schema for validating YouTube URLs
export const videoSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return regex.test(url);
      },
      { message: "Please enter a valid YouTube URL" }
    ),
});

// Type for timeline entries
export interface TimelineEntry {
  timestamp: number;
  topic: string;
  description: string;
}

// Schema for timeline entries
export const timelineEntrySchema = z.object({
  timestamp: z
    .number()
    .describe("The timestamp in seconds when the topic begins"),
  topic: z
    .string()
    .describe("A brief description of the topic being discussed"),
  description: z
    .string()
    .describe("A detailed description of the topic, if necessary"),
});

// Schema for the complete timeline
export const timelineSchema = z.array(timelineEntrySchema);
