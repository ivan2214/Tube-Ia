"use server";

import { formatTime } from "@/shared/utils/format-time";
import { google } from "googleapis";
import { type TranscriptResponse, YoutubeTranscript } from "youtube-transcript";

// Define types for our return values
interface VideoDetails {
  title: string;
  description: string;
  duration: number; // Duration in seconds
  thumbnailUrl?: string;
  channelTitle?: string;
  publishedAt?: string;
}

// Initialize the YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // You'll need to add this to your environment variables
});

// Helper function to convert ISO 8601 duration to seconds
function isoDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export async function getVideoDetails(videoId: string): Promise<VideoDetails> {
  try {
    // Fetch video details from YouTube API
    const response = await youtube.videos.list({
      part: ["snippet", "contentDetails"],
      id: [videoId],
    });

    const video = response.data.items?.[0];

    if (!video) {
      console.error("Video not found:", videoId);
      return {
        title: "Video Not Found",
        description: "The requested video could not be found.",
        duration: 0,
      };
    }

    // Extract the duration in seconds from the ISO 8601 duration format
    const durationISO = video.contentDetails?.duration || "PT0S";
    const durationSeconds = isoDurationToSeconds(durationISO);

    return {
      title: video.snippet?.title || "Unknown Title",
      description: video.snippet?.description || "No description available",
      duration: durationSeconds,
      thumbnailUrl: video.snippet?.thumbnails?.high?.url || undefined,
      channelTitle: video.snippet?.channelTitle || undefined,
      publishedAt: video.snippet?.publishedAt || undefined,
    };
  } catch (error) {
    console.error("Error fetching video details:", error);

    // Return fallback data in case of error
    return {
      title: "Error Loading Video",
      description: "There was an error loading the video details.",
      duration: 0,
    };
  }
}

export async function getVideoTranscript(videoId: string): Promise<string> {
  try {
    // Validar que el ID del video sea válido
    if (!videoId || typeof videoId !== "string") {
      throw new Error("Invalid video ID provided");
    }

    console.log(`Attempting to fetch transcript for video: ${videoId}`);

    try {
      const transcript: TranscriptResponse[] =
        await YoutubeTranscript.fetchTranscript(videoId);

      if (!transcript || transcript.length === 0) {
        console.error(`No transcript available for video: ${videoId}`);
        return "Este video no tiene transcripción disponible. YouTube no proporciona subtítulos para este contenido.";
      }

      console.log(
        `Successfully fetched transcript with ${transcript.length} entries`
      );

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
    } catch (specificError) {
      // Capturar el error específico de transcripción deshabilitada
      if (
        specificError instanceof Error &&
        specificError.message.includes("Transcript is disabled on this video")
      ) {
        console.error(`Transcript is disabled for video ${videoId}`);
        return "Este video tiene la transcripción deshabilitada por el creador del contenido. No es posible obtener subtítulos para este video.";
      }

      // Re-lanzar otros errores
      throw specificError;
    }
  } catch (error) {
    // Mejorar el registro de errores para diagnóstico
    console.error("Error fetching transcript:", error);
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }

    // En lugar de lanzar un error, devolver un mensaje amigable
    return "No se pudo obtener la transcripción del video. Es posible que el video no tenga subtítulos disponibles o que estén deshabilitados por el creador.";
  }
}

// Optional: Function to get video chapters from description
export async function getVideoChapters(
  videoId: string
): Promise<Array<{ time: number; title: string }>> {
  try {
    const { description } = await getVideoDetails(videoId);

    // Look for timestamp patterns in the description (e.g., "0:00 Introduction")
    const chapterRegex =
      /(\d+:(?:\d+:)?\d+)\s+(.+?)(?=\n\d+:(?:\d+:)?\d+|\n\n|$)/g;
    const chapters = [];
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((match = chapterRegex.exec(description)) !== null) {
      const timeStr = match[1];
      const title = match[2].trim();

      // Convert timestamp to seconds
      const timeParts = timeStr.split(":").map(Number);
      let seconds = 0;

      if (timeParts.length === 3) {
        // hours:minutes:seconds
        seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
      } else if (timeParts.length === 2) {
        // minutes:seconds
        seconds = timeParts[0] * 60 + timeParts[1];
      }

      chapters.push({ time: seconds, title });
    }

    return chapters;
  } catch (error) {
    console.error("Error extracting chapters:", error);
    return [];
  }
}
