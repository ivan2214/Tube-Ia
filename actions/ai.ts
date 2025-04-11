"use server";

import { google } from "@ai-sdk/google";
import { streamObject, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { YoutubeTranscript } from "youtube-transcript";
import { videoSchema, timelineSchema } from "@/schemas/video";
import { formatTime } from "@/utils/format-time";

const gemini = google("gemini-2.0-flash-001");

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Fetch YouTube transcript with chunking for longer videos
async function getVideoTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "es",
    });

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

export async function processVideo(url: string) {
  // Validate the URL
  const { url: validatedUrl } = videoSchema.parse({ url });

  // Extract video ID
  const videoId = extractVideoId(validatedUrl);
  if (!videoId) {
    throw new Error("Could not extract video ID from URL");
  }

  const stream = createStreamableValue();

  // Fetch transcript first
  let transcript: string;
  try {
    transcript = await getVideoTranscript(videoId);
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
          Create a comprehensive timeline of topics discussed in the video based on this transcript.
          
          For each significant topic or section change in the video, provide:
          1. The timestamp in seconds when the topic begins
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
          
          Identify at least 5-10 key sections in the video. Convert any timestamp format (like MM:SS) to seconds.
          For longer videos (over 30 minutes), identify more sections to provide a comprehensive overview.
          Ensure you capture the main topics throughout the entire video, not just the beginning.
          Always provide your responses in Spanish.
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
  };
}

export async function chatWithVideo(
  message: string,
  videoId: string,
  transcript: string
) {
  const stream = createStreamableValue<string>();

  // Process transcript in chunks if it's too long
  const maxChunkSize = 15000;
  const transcriptChunks = [];

  // Split transcript into manageable chunks
  for (let i = 0; i < transcript.length; i += maxChunkSize) {
    transcriptChunks.push(transcript.substring(i, i + maxChunkSize));
  }

  // Get a summary of the full transcript for context
  let transcriptSummary = "";
  if (transcriptChunks.length > 1) {
    try {
      const { text } = await streamText({
        model: gemini,
        system: `
          You are a helpful assistant that summarizes YouTube video transcripts.
          Your goal is to provide a concise summary of the main points discussed in the video.
          The summary should be understandable by a general audience and should be no more than 500 words.
          Avoid unnecessary details or tangential points.
          Always provide your responses in Spanish.
        `,
        prompt: `
          Summarize the following video transcript in about 500 words. Focus on the main topics and key points:
          
          ${transcript.substring(0, 30000)}
          
          ${transcript.length > 30000 ? "... (transcript continues)" : ""}
        `,
        maxTokens: 1000,
      });

      transcriptSummary = await text;
    } catch (error) {
      console.error("Error generating transcript summary:", error);
      transcriptSummary = "Error generating summary of the full transcript.";
    }
  }
  (async () => {
    try {
      const { textStream } = streamText({
        model: gemini,
        prompt: `
          You are an AI assistant specialized in discussing and explaining YouTube video content.
          You have access to the transcript of a video with ID: ${videoId}.
          Always provide your responses in Spanish.
          
          ${
            transcriptChunks.length > 1
              ? `This is a longer video. Here's a summary of the full content: ${transcriptSummary}`
              : ""
          }
          
          The user is asking about this specific video. Provide helpful, accurate, and concise responses
          based on the video content. If you don't know something or if it's not covered in the transcript,
          be honest about it.
          
          Here's the relevant part of the transcript:
          ${transcriptChunks[0]}
          
          User's message: ${message}
        `,
        maxTokens: 1000,
      });

      for await (const chunk of textStream) {
        stream.update(chunk);
      }

      stream.done();
    } catch (error) {
      console.error("Error in chatWithVideo:", error);
      stream.error(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  })();

  return { stream: stream.value };
}
