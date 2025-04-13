import { google } from "@ai-sdk/google";
import { type Message, streamText } from "ai";
import type { NextRequest } from "next/server";

const gemini = google("gemini-2.0-flash-001");

export const maxDuration = 30;

export async function POST(req: NextRequest) {
	try {
		const { messages, videoId, transcript, videoTitle } = await req.json();

		// Get the last user message
		const lastUserMessage =
			messages.filter((m: Message) => m.role === "user").pop()?.content || "";

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
				const { text } = streamText({
					model: gemini,
					prompt: `
            Summarize the following video transcript in about 500 words. Focus on the main topics and key points:
            
            ${transcript.substring(0, 30000)}
            
            ${transcript.length > 30000 ? "... (transcript continues)" : ""}
          `,
					maxTokens: 1000,
					onChunk: (chunk) => {
						transcriptSummary += chunk;
					},

					onError: (error) => {
						console.error("Error generating transcript summary:", error);
					},
				});
			} catch (error) {
				console.error("Error generating transcript summary:", error);
				transcriptSummary = "Error generating summary of the full transcript.";
			}
		}

		// Create the stream
		const result = streamText({
			model: gemini,
			system: `
      Always response in spanish.
      You are an AI assistant specialized in discussing and explaining YouTube video content.
      You have access to the transcript of a video titled: "${
				videoTitle || "YouTube Video"
			}" with ID: ${videoId}.
      
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
      
      User's message: ${lastUserMessage}
        `,
			messages,
			maxTokens: 1000,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Error in chat route:", error);
		return new Response(
			JSON.stringify({ error: "Failed to process chat request" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
