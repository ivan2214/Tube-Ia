"use server";

import {
  type TimelineEntry,
  timelineSchema,
  videoSchema,
} from "@/schemas/video";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";

import { cookies } from "next/headers";

const gemini = google("gemini-2.0-flash-001");

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function processVideo(url: string) {
  "use server";

  const stream = createStreamableValue();

  // Validate the URL
  const { url: validatedUrl } = videoSchema.parse({ url });

  // Extract video ID
  const videoId = extractVideoId(validatedUrl);
  if (!videoId) {
    throw new Error("Could not extract video ID from URL");
  }

  (async () => {
    const { partialObjectStream } = streamObject({
      model: gemini,
      schema: timelineSchema,
      prompt: `
				You are a video content analyzer. Given the YouTube video ID: ${videoId}, 
				create a timeline of topics discussed in the video. 
				
				For each significant topic or section change in the video, provide:
				1. The timestamp in seconds when the topic begins
				2. A brief description of the topic being discussed
				
				Format your response as an array of objects, each with 'timestamp' (number in seconds) and 'topic' (string) properties.
				
				Example:
				[
					{ "timestamp": 0, "topic": "Introduction to the video" },
					{ "timestamp": 120, "topic": "First main concept explained" }
				]
				
				Try to identify at least 5-10 key sections in the video.

				Responder en español siempre
			`,
      schemaDescription:
        "An array of objects, each with 'timestamp' (number in seconds) and 'topic' (string) properties",
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
      console.log(partialObject);
    }
    stream.done();
  })();

  return {
    object: stream.value,
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
