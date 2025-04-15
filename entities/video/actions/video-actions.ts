"use server";

export async function getVideoDetails(videoId: string) {
  try {
    const response = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    if (!response.ok) throw new Error("Failed to fetch video details");

    const data = await response.json();

    // Verificación robusta de la duración
    let duration = 0;
    if (data.duration) {
      duration = parseDuration(data.duration);
    } else {
      // Intento alternativo de obtener la duración
      duration = await getDurationFromYoutubePlayer(videoId);
    }

    return {
      title: data.title || "Video sin título",
      description: data.description || "",
      duration: duration > 0 ? duration : 0, // Asegurar no negativo
      thumbnails: data.thumbnail_url ? [data.thumbnail_url] : [],
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    return {
      title: "Video sin título",
      description: "",
      duration: 0, // Valor por defecto seguro
      thumbnails: [],
    };
  }
}

// Función alternativa para obtener duración
async function getDurationFromYoutubePlayer(videoId: string): Promise<number> {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();

    // Buscar la duración en el HTML
    const durationRegex = /"approxDurationMs":"(\d+)"/;
    const match = html.match(durationRegex);

    if (match) {
      return Math.floor(Number.parseInt(match[1]) / 1000); // Convertir ms a segundos
    }
    return 0;
  } catch {
    return 0;
  }
}

// Función más robusta para parsear duración
function parseDuration(durationStr: string | number): number {
  if (typeof durationStr === "number") return durationStr;

  try {
    const parts = durationStr.split(":").reverse();
    let seconds = 0;

    if (parts[0]) seconds += Number(parts[0]);
    if (parts[1]) seconds += Number(parts[1]) * 60;
    if (parts[2]) seconds += Number(parts[2]) * 3600;

    return seconds;
  } catch (error) {
    console.error("Error parsing duration:", error);
    return 0;
  }
}

export async function getTranscriptFromScrapingSimplified(
  videoId: string
): Promise<Array<{ text: string; start: number }> | null> {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();

    // Buscar JSON con las transcripciones
    const regex = /"captionTracks":(\[.*?\])/;
    const match = html.match(regex);

    if (!match) return null;

    const captionTracks = JSON.parse(match[1]);
    if (!captionTracks.length) return null;

    // Obtener la transcripción en español o la primera disponible
    const spanishTrack =
      captionTracks.find((track: any) => track.languageCode.includes("es")) ||
      captionTracks[0];

    const transcriptResponse = await fetch(spanishTrack.baseUrl);
    const transcriptXml = await transcriptResponse.text();

    // Extraer texto y tiempos del XML
    const timeTextMatches = transcriptXml.match(
      /<text start="([^"]+)"[^>]*>([^<]+)<\/text>/g
    );
    if (!timeTextMatches) return null;

    const transcriptWithTimes = [];
    for (const match of timeTextMatches) {
      const startMatch = match.match(/start="([^"]+)"/);
      const textMatch = match.match(/>([^<]+)</);

      if (startMatch && textMatch) {
        transcriptWithTimes.push({
          text: textMatch[1],
          start: Number.parseFloat(startMatch[1]),
        });
      }
    }

    console.log(transcriptWithTimes);

    return transcriptWithTimes.length > 0 ? transcriptWithTimes : null;
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  }
}
