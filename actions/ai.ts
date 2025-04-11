"use server";

import {
  type TimelineEntry,
  timelineSchema,
  videoSchema,
} from "@/schemas/video";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { YoutubeTranscript } from "youtube-transcript";

import { cookies } from "next/headers";

const gemini = google("gemini-2.0-flash-001");

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Fetch YouTube transcript
async function getVideoTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0) {
      throw new Error("No transcript available for this video");
    }

    // Format transcript with timestamps
    return transcript
      .map((item) => `[${formatTime(item.offset / 1000)}] ${item.text}`)
      .join("\n");
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(
      "Failed to fetch video transcript. The video may not have captions available."
    );
  }
}

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export async function processVideo(url: string) {
  "use server";

  // Validate the URL
  const { url: validatedUrl } = videoSchema.parse({ url });

  // Extract video ID
  const videoId = extractVideoId(validatedUrl);
  if (!videoId) {
    throw new Error("Could not extract video ID from URL");
  }

  const stream = createStreamableValue();

  // Create a promise to handle the async processing
  (async () => {
    try {
      // Fetch video transcript
      const transcript = await getVideoTranscript(videoId);

      // Use AI to analyze transcript and generate timeline
      const { partialObjectStream } = streamObject({
        model: gemini,
        schema: timelineSchema,
        prompt: `
          You are a video content analyzer. I'll provide you with a YouTube video transcript with timestamps.
          Create a timeline of topics discussed in the video based on this transcript.
          
          For each significant topic or section change in the video, provide:
          1. The timestamp in seconds when the topic begins
          2. A brief description of the topic being discussed
          
          Format your response as an array of objects, each with 'timestamp' (number in seconds) and 'topic' (string) properties.
          
          Here's the transcript:
          ${transcript}
          
          Example output format:
          [
            { "timestamp": 0, "topic": "Introduction to the video" },
            { "timestamp": 120, "topic": "First main concept explained" }
          ]
          
          Identify at least 5-10 key sections in the video. Convert any timestamp format (like MM:SS) to seconds.
          Ensure the return always in spanish.
        `,
        schemaDescription:
          "An array of objects, each with 'timestamp' (number in seconds) and 'topic' (string) properties",
      });

      for await (const partialObject of partialObjectStream) {
        stream.update(partialObject);
      }

      stream.done();
    } catch (error) {
      console.error("Error in processVideo:", error);
      stream.error(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  })();

  return {
    object: stream.value,
    videoId,
  };
}

export async function getTimelineResults(): Promise<{
  entries: TimelineEntry[];
  videoId: string | null;
}> {
  const timelineCookie = (await cookies()).get("timeline");
  const videoIdCookie = (await cookies()).get("currentVideoId");

  let entries: TimelineEntry[] = [];
  let videoId: string | null = null;

  if (timelineCookie?.value) {
    try {
      entries = JSON.parse(timelineCookie.value);
    } catch (e) {
      console.error("Error parsing timeline cookie:", e);
    }
  }

  if (videoIdCookie?.value) {
    videoId = videoIdCookie.value;
  }

  return { entries, videoId };
}
