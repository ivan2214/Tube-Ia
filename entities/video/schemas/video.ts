import { z } from "zod";

// Schema for validating YouTube URLs
export const videoSchema = z.object({
	url: z
		.string()
		.url("Please enter a valid URL")
		.refine(
			(url) => {
				const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
				return regex.test(url);
			},
			{ message: "Please enter a valid YouTube URL" },
		),
});

// Type for timeline entries
export interface TimelineEntry {
	timestamp: number;
	topic: string;
	description: string;
}

// Schema for timeline entries
export const timelineEntrySchema = z.object({
	timestamp: z
		.number()
		.describe(
			"El momento en segundos cuando comienza el tema. Por ejemplo, 120 para 2 minutos",
		),
	topic: z
		.string()
		.describe("Un título corto o resumen del tema que se está discutiendo"),
	description: z
		.string()
		.describe(
			"Una descripción detallada y completa del tema tratado en este segmento",
		),
});

// Schema for the complete timeline
export const timelineSchema = z.array(timelineEntrySchema);
