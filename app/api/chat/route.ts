import type { TimelineEntry } from "@/entities/timeline/types";
import { getVideoDetails } from "@/entities/video/actions/video-actions";
import { getApiKey } from "@/shared/actions/api-key-actions";
import { formatTime } from "@/shared/utils/format-time";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, videoId, timeline } = await req.json();

  const { apiKey } = await getApiKey();

  if (!apiKey) {
    return {
      object: null,
      error: "API_KEY_REQUIRED",
    };
  }

  // Initialize Google AI with the user's API key
  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const model = google("gemini-2.0-flash-001");

  // Get video details to provide context
  const videoDetails = await getVideoDetails(videoId);

  // Create a context from the timeline
  const timelineContext = timeline
    ?.map(
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
