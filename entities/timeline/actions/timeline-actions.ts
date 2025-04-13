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

const model = google("gemini-2.0-flash-001");

export async function generateVideoTimeline(videoId: string) {
  const videoDetails = await getVideoDetails(videoId);
  const transcript = await getVideoTranscript(videoId);

  if (!transcript) {
    return {
      object: null,
      error: "Transcript not found",
    };
  }

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

🔹 TRANSCRIPCIÓN:
${transcript}

🧠 Instrucciones:
- Crea entre 5 y 15 entradas que representen los puntos clave del video.
- Cada entrada debe incluir:
  - "time": marca de tiempo en segundos (por ejemplo: 90 para 1 minuto y 30 segundos).
  - "title": un título breve que resuma el contenido del momento.
  - "description": una descripción detallada en español de lo que ocurre en ese instante.
- Asegúrate de que las marcas de tiempo estén bien sincronizadas con el contenido del video.
- El formato debe coincidir exactamente con el esquema JSON esperado.
- Siempre responde en **español**.

📌 Ejemplo de formato de salida:
[
  {
    "time": 15,
    "title": "Inicio del video",
    "description": "El presentador se presenta y explica el objetivo del video."
  },
  {
    "time": 105,
    "title": "Primer tema importante",
    "description": "Se comienza a explicar el primer punto clave con ejemplos."
  }
]
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
