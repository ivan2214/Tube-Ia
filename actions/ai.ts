"use server";

import { videoSchema, timelineSchema } from "@/schemas/video";
import {
  extractVideoId,
  getVideoTitle,
  getVideoTranscript,
} from "@/utils/video";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";

const gemini = google("gemini-2.0-flash-001");

export async function processVideo(url: string) {
  // Validate the URL
  const { url: validatedUrl } = videoSchema.parse({ url });

  // Extract video ID
  const videoId = extractVideoId(validatedUrl);
  if (!videoId) {
    throw new Error("Could not extract video ID from URL");
  }

  const stream = createStreamableValue();

  // Fetch transcript and video title
  let transcript: string;
  let videoTitle: string | null = null;

  try {
    transcript = await getVideoTranscript(videoId);
    videoTitle = await getVideoTitle(videoId);
  } catch (error) {
    throw new Error(
      `Failed to process video: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
  // Create a promise to handle the async processing
  (async () => {
    try {
      // Use AI to analyze transcript and generate timeline
      const { partialObjectStream } = streamObject({
        model: gemini,
        schema: timelineSchema,
        prompt: `
          You are a video content analyzer. I'll provide you with a YouTube video transcript with timestamps.
          Create a precise timeline of topics discussed in the video based on this transcript.
          Ensure always respond in spanish.
          
          For each significant topic or section change in the video, provide:
          1. The timestamp in seconds when the topic begins (be very precise with this)
          2. A brief description of the topic being discussed
          3. A detailed description of what the topic covers
          
          Format your response as an array of objects, each with:
          - 'timestamp' (number in seconds)
          - 'topic' (string, a brief title)
          - 'description' (string, a detailed explanation)
          
          Here's the transcript:
          ${transcript}
          
          Example output format:
          [
            { 
              "timestamp": 0, 
              "topic": "Introduction to the video", 
              "description": "The speaker introduces themselves and provides an overview of what will be covered in the video."
            },
            { 
              "timestamp": 120, 
              "topic": "First main concept", 
              "description": "Detailed explanation of the first concept, including key points and examples."
            }
          ]
          
          IMPORTANT INSTRUCTIONS:
          1. Be extremely precise with timestamps - they must match exactly when the topic is discussed in the video
          2. Ensure timestamps are in chronological order
          3. Identify at least 5-10 key sections in the video
          4. For longer videos (over 30 minutes), identify more sections to provide a comprehensive overview
          5. Ensure you capture the main topics throughout the entire video, not just the beginning
          6. Convert any timestamp format (like MM:SS) to seconds
          7. Verify that each topic accurately reflects the content at that specific timestamp
        `,
        schemaDescription:
          "An array of objects with timestamp, topic, and description properties",
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
    transcript,
    videoTitle,
  };
}
