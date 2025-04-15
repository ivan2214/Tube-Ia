"use server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import {
  getVideoDetails,
  getTranscriptFromScrapingSimplified,
} from "@/entities/video/actions/video-actions";
import { createStreamableValue } from "ai/rsc";
import { getApiKey } from "@/shared/actions/api-key-actions";

const timelineSchema = z.object({
  title: z.string().describe("Título del video"),
  timeline: z
    .array(
      z.object({
        time: z
          .number()
          .describe("Marca de tiempo en segundos desde el inicio del video"),
        title: z.string().describe("Título corto del momento clave"),
        description: z
          .string()
          .describe("Descripción detallada de lo que ocurre en ese momento"),
      })
    )
    .describe("Entradas de la línea de tiempo para los momentos clave"),
});

export async function generateVideoTimeline(videoId: string) {
  try {
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

    const videoDetails = await getVideoDetails(videoId);
    const transcriptData = await getTranscriptFromScrapingSimplified(videoId);

    if (!transcriptData) {
      console.error("No se pudo obtener la transcripción del video");
      return {
        object: null,
        error: "No se pudo obtener la transcripción del video",
      };
    }

    // Formatear la transcripción con marcas de tiempo
    // Formatear la transcripción con marcas de tiempo
    const formattedTranscript = transcriptData
      .map((entry) => {
        // Validar tiempo
        if (entry.start < 0) {
          console.warn("Tiempo negativo encontrado:", entry);
          return `[TIEMPO INVÁLIDO] ${entry.text}`;
        }

        const minutes = Math.floor(entry.start / 60);
        const seconds = Math.floor(entry.start % 60);

        // Validar valores numéricos
        if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
          console.warn("Tiempo no numérico:", entry);
          return `[TIEMPO INVÁLIDO] ${entry.text}`;
        }

        return `[${minutes}:${seconds.toString().padStart(2, "0")}] ${
          entry.text
        }`;
      })
      .join("\n");

    console.log("Video Details en timeline-actions:", {
      videoDetails,
    });

    const stream = createStreamableValue();

    (async () => {
      const { partialObjectStream } = streamObject({
        model,
        schema: timelineSchema,
        prompt: `
Actúa como un asistente experto en análisis de contenido audiovisual.

Tu tarea es analizar el siguiente video de YouTube y generar una línea de tiempo en español con los momentos más importantes del contenido. Usa la transcripción como base para identificar estos momentos.

🔹 TÍTULO DEL VIDEO:
${videoDetails.title}

🔹 DESCRIPCIÓN DEL VIDEO:
${videoDetails.description}

🔹 DURACIÓN DEL VIDEO:
${Math.floor(videoDetails.duration / 60)}:${String(
          videoDetails.duration % 60
        ).padStart(2, "0")} (${videoDetails.duration} segundos)

🔹 TRANSCRIPCIÓN:
${formattedTranscript}

🧠 Instrucciones:
- Crea entre 5 y 15 entradas que representen los puntos clave del video.
- Cada entrada debe incluir:
  - "time": marca de tiempo en segundos (por ejemplo: 90 para 1 minuto y 30 segundos).
  - "title": un título breve que resuma el contenido del momento.
  - "description": una descripción detallada en español de lo que ocurre en ese instante.
- IMPORTANTE: Todas las marcas de tiempo DEBEN ser menores que la duración total del video (${
          videoDetails.duration
        } segundos).
- Asegúrate de que las marcas de tiempo estén bien sincronizadas con el contenido del video.
- El formato debe coincidir exactamente con el esquema JSON esperado.
- Siempre responde en **español**.
      `,
      });

      for await (const partialObject of partialObjectStream) {
        // Validar que los tiempos no excedan la duración del video
        if (partialObject.timeline) {
          partialObject.timeline = partialObject.timeline.map((entry) => ({
            ...entry,
            time: Math.min(entry?.time || 0, videoDetails.duration - 1),
          }));
        }
        stream.update(partialObject);
      }
      stream.done();
    })();

    return {
      object: stream.value,
      title: videoDetails.title,
      duration: videoDetails.duration,
      details: formattedTranscript,
    };
  } catch (error) {
    console.log("Error en generateVideoTimeline:", error);

    console.error("Error en generateVideoTimeline:", error);
    return {
      object: null,
      error: "Error en generateVideoTimeline",
    };
  }
}
