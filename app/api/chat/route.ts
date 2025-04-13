import type { TimelineEntry } from "@/entities/timeline/types";
import { getVideoDetails } from "@/entities/video/actions/video-actions";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

const model = google("gemini-2.0-flash-001");

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, videoId, timeline } = await req.json();

  // Get video details to provide context
  const videoDetails = await getVideoDetails(videoId);

  // Create a context from the timeline
  const timelineContext = timeline
    .map(
      (entry: TimelineEntry) =>
        `[${formatTime(entry.time)}] ${entry.title}: ${entry.description}`
    )
    .join("\n");

  const systemPrompt = `
    You are an AI assistant that helps users understand YouTube videos.
    Always response in spanish.
    
    VIDEO TITLE: ${videoDetails.title}
    VIDEO DESCRIPTION: ${videoDetails.description}
    
    VIDEO TIMELINE:
    ${timelineContext}
    
    When answering questions:
    1. Reference specific timestamps when relevant
    2. Be concise but informative
    3. If you don't know something about the video, admit it
    4. If the user asks about something not in the timeline, say you can only discuss what's in the video
  `;

  const result = streamText({
    model,
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
