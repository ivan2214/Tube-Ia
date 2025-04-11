"use server";

import { timelineSchema, videoSchema } from "@/entities/video/schemas/video";
import {
	extractVideoId,
	getVideoTitle,
	getVideoTranscript,
} from "@/entities/video/utils/video-utils";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";

const gemini = google("gemini-2.0-flash-001");

const systemPrompt = `
Eres un analista experto en contenido de video. Tu tarea es analizar transcripciones de videos para identificar los temas discutidos y construir una línea de tiempo clara y precisa.

Tus respuestas deben ser en español. Siempre responde usando el formato JSON especificado. No incluyas explicaciones adicionales fuera de ese formato.
`;

export async function processVideo(url: string) {
	// Validate the URL
	const { url: validatedUrl } = videoSchema.parse({ url });

	// Extract video ID
	const videoId = extractVideoId(validatedUrl);
	if (!videoId) {
		throw new Error("Could not extract video ID from URL");
	}

	const stream = createStreamableValue();

	// Fetch transcript and video title
	let transcript: string;
	let videoTitle: string | null = null;

	try {
		transcript = await getVideoTranscript(videoId);
		videoTitle = await getVideoTitle(videoId);
	} catch (error) {
		throw new Error(
			`Failed to process video: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
	// Create a promise to handle the async processing
	(async () => {
		try {
			const userPrompt = `
A continuación te proporciono la transcripción de un video de YouTube, con marcas de tiempo.

Identifica los cambios significativos de tema a lo largo del video y genera una línea de tiempo detallada. Para cada sección importante, proporciona:

1. El timestamp en segundos exactos cuando comienza (como número, entero o decimal)
2. Un título breve del tema (máximo 10 palabras)
3. Una descripción clara y detallada de lo que se trata en esa sección

Requisitos:
- Usa los timestamps del transcript para ser preciso
- Ordena cronológicamente los temas
- Detecta entre 5 y 10 secciones clave (más si el video es largo)
- No omitas las partes finales del video
- Si hay timestamps en formato HH:MM:SS, conviértelos a segundos
- Responde solo con el JSON solicitado, sin explicaciones

Formato de salida:
[
  {
    "timestamp": 0,
    "topic": "Introducción",
    "description": "El presentador se presenta y da una visión general del video."
  },
  {
    "timestamp": 92.5,
    "topic": "Compresión del concreto",
    "description": "Se analiza cómo el concreto actúa bajo compresión, con ejemplos visuales."
  }
  // ...
]

Aquí está la transcripción:
${transcript}
`;

			// Use AI to analyze transcript and generate timeline
			const { partialObjectStream } = streamObject({
				model: gemini,
				schema: timelineSchema,
				system: systemPrompt,
				prompt: userPrompt,
				schemaDescription:
					"Un arreglo de objetos que contiene propiedades de marca de tiempo (timestamp), tema (topic) y descripción detallada (description)",
			});

			for await (const partialObject of partialObjectStream) {
				stream.update(partialObject);
			}

			stream.done();
		} catch (error) {
			console.error("Error in processVideo:", error);
			stream.error(
				error instanceof Error ? error : new Error("Unknown error occurred"),
			);
		}
	})();

	return {
		object: stream.value,
		videoId,
		transcript,
		videoTitle,
	};
}
