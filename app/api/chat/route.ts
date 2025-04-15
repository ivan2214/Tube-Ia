import { db } from "@/db";

import { getApiKey } from "@/shared/actions/api-key-actions";
import { formatTime } from "@/shared/utils/format-time";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, videoId } = await req.json(); // ya no esperás timeline

  const { apiKey } = await getApiKey();
  if (!apiKey) {
    return NextResponse.json({
      error: "No API key found",
      success: false,
    });
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google("gemini-2.0-flash-001", {
    useSearchGrounding: true,
  });

  const videoDetails = await db.video.findUnique({
    where: { id: videoId },
  });

  if (!videoDetails) {
    return NextResponse.json({ error: "Video not found", success: false });
  }

  const timeline = await db.timeline.findMany({
    where: { videoId },
    orderBy: { time: "asc" },
  });

  const timelineContext = timeline
    .map(
      (entry) =>
        `[${formatTime(entry.time)}] ${entry.title}: ${entry.description}`
    )
    .join("\n");

  const systemPrompt = `
    Eres un asistente de IA que ayuda a entender el contenido de videos de YouTube.
    Siempre responde en español.

    📹 TÍTULO DEL VIDEO:
    ${videoDetails.title}

    📝 DETALLES DEL VIDEO:
    ${videoDetails.details}

    🕒 DURACIÓN:
    ${Math.floor(videoDetails.duration / 60)}:${String(
    videoDetails.duration % 60
  ).padStart(2, "0")} minutos

    🧩 LÍNEA DE TIEMPO DEL VIDEO:
    ${timelineContext}

    📌 INSTRUCCIONES PARA RESPONDER:
    - Cita los momentos del video si es relevante
    - Sé conciso pero informativo
    - Si algo no está en el video, dilo
    - Solo puedes hablar sobre lo que está en el contenido y la línea de tiempo
  `;

  const result = streamText({
    model,
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
