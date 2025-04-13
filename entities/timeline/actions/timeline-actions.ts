"use server";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import {
  getVideoTranscript,
  getVideoDetails,
} from "@/entities/video/actions/video-actions";
import { createStreamableValue } from "ai/rsc";

const timelineSchema = z.object({
  title: z.string().describe("The title of the video"),
  timeline: z
    .array(
      z.object({
        time: z.number().describe("Timestamp in seconds"),
        title: z.string().describe("Short title for this section"),
        description: z
          .string()
          .describe("Brief description of what happens at this timestamp"),
      })
    )
    .describe("Timeline entries for key moments in the video"),
});

const model = google("gemini-2.0-flash-001");

export async function generateVideoTimeline(videoId: string) {
  // Get video details and transcript
  const videoDetails = await getVideoDetails(videoId);
  const transcript = await getVideoTranscript(videoId);

  if (!transcript) {
    return {
      object: null,
      error: "Transcript not found",
    };
  }

  const stream = createStreamableValue();

  // Generate timeline using AI

  (async () => {
    const { partialObjectStream } = streamObject({
      model,
      schema: timelineSchema,
      prompt: `
          Create a detailed timeline for this YouTube video.
          
          VIDEO TITLE: ${videoDetails.title}
          VIDEO DESCRIPTION: ${videoDetails.description}
          
          TRANSCRIPT:
          ${transcript}
          
          Create 5-15 timeline entries for key moments in the video.
          Each entry should have a timestamp (in seconds), a short title, and a brief description.
          Make sure the timestamps are in chronological order.
          Ensure always response in spanish.
        `,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
    stream.done();
  })();

  return {
    object: stream.value,
    title: videoDetails.title,
  };
}
