import { type TranscriptResponse, YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
import { formatTime } from "@/utils/format-time";

// Extract YouTube video ID from URL
export function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Fetch video title from YouTube API
export async function getVideoTitle(videoId: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`
    );
    return response.data.items[0]?.snippet?.title || null;
  } catch (error) {
    console.error("Error fetching video title:", error);
    return null;
  }
}

// Fetch YouTube transcript with chunking for longer videos
export async function getVideoTranscript(videoId: string): Promise<string> {
  try {
    const transcript: TranscriptResponse[] =
      await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "es", // Ensure English transcript if available
      });

    if (!transcript || transcript.length === 0) {
      throw new Error("No transcript available for this video");
    }

    // Format transcript with timestamps and ensure they're in chronological order
    return transcript
      .sort((a, b) => a.offset - b.offset)
      .map(
        (item) =>
          `[${formatTime(item.offset)} - ${formatTime(
            item.offset + item.duration
          )}] ${item.text}`
      )
      .join("\n");
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(
      "Failed to fetch video transcript. The video may not have captions available."
    );
  }
}
