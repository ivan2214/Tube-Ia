import { db } from "@/db";

import { getApiKey } from "@/shared/actions/api-key-actions";
import { formatTime } from "@/shared/utils/format-time";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();

  const { apiKey } = await getApiKey();
  if (!apiKey) {
    return NextResponse.json({
      error: "No API key found",
      success: false,
    });
  }

  const google = createGoogleGenerativeAI({ apiKey });
  // Enable search grounding to allow the model to search the internet
  const model = google("gemini-2.0-flash-001", {
    useSearchGrounding: true,
    dynamicRetrievalConfig: {
      mode: "MODE_DYNAMIC",
    },
  });

  // Get more comprehensive video details
  const videoDetails = await db.video.findUnique({
    where: { id: videoId },
    include: {
      timeline: {
        orderBy: { time: "asc" },
      },
    },
  });

  if (!videoDetails) {
    return NextResponse.json({ error: "Video not found", success: false });
  }

  // Format timeline with more structured information
  const timelineContext = videoDetails.timeline
    .map((entry) => {
      // Ensure the time is correctly formatted and accurate
      const formattedTime = formatTime(entry.time);
      return `[${formattedTime}] ${entry.title}: ${entry.description}`;
    })
    .join("\n");

  const systemPrompt = `
    Eres un asistente de IA que ayuda a entender el contenido de videos de YouTube.
    Siempre responde en español.

    📹 TÍTULO DEL VIDEO:
    ${videoDetails.title}

    🔗 URL DEL VIDEO:
    ${videoDetails.url || "No disponible"}

    ⏱️ DURACIÓN:
    ${formatTime(videoDetails.duration)} minutos

    🧩 LÍNEA DE TIEMPO DEL VIDEO:
    ${timelineContext}
    ${videoDetails.details}

    📌 INSTRUCCIONES PARA RESPONDER:
    - Cita los momentos específicos del video cuando sea relevante usando el formato [HH:MM:SS]
    - Asegúrate de que los tiempos que menciones sean precisos y correspondan al contenido real del video
    - Sé conciso pero informativo
    - Si la información solicitada no está en el video o en la línea de tiempo, BUSCA EN INTERNET para complementar tu respuesta
    - Cuando uses información de internet, indica claramente que es información adicional no presente en el video
    - Prioriza siempre la información del video sobre la información de internet
    - Cuando menciones información de la línea de tiempo, incluye la marca de tiempo correspondiente
    - Si te preguntan por un tema completamente no relacionado con el video, responde brevemente y sugiere volver al tema del video
    - Cuando busques en internet, usa el título del video y palabras clave de la pregunta para obtener información relevante
  `;

  const result = streamText({
    model,
    messages,
    system: systemPrompt,
    temperature: 0.7,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
