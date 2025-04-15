"use server";

import axios from "axios";
import type { ResponseVideoDetailsFastApi } from "../types";
import { DOMParser } from "xmldom";

async function checkAndProcess<T>(
  promise: Promise<T>,
  errorMessage: string
): Promise<T> {
  const result = await promise;

  if (!result) {
    throw new Error(errorMessage);
  }
  return result;
}

export async function getVideoDetails(videoId: string) {
  if (!videoId) {
    throw new Error("Video id is necessary");
  }

  const options = {
    method: "GET",
    url: process.env.RAPID_API_URL,
    params: { id: videoId },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": process.env.RAPID_API_HOST,
    },
  };

  try {
    const videoDetails = await checkAndProcess(
      CheckVideoDetails(options),
      "Failed to get video length"
    );

    const maxHours = 1;
    const maxMinutes = 10;
    const max = maxHours * 60 + maxMinutes;

    if (Number(videoDetails?.lengthSeconds) > max * 60) {
      throw new Error(
        `Video duration must be less than ${maxHours} hours and ${maxMinutes} minutes`
      );
    }

    const videoTranscript = await checkAndProcess(
      getVideoTranscript(options),
      "Failed to get video subtitles"
    );

    const parsedTranscript = await parseXMLContent(
      videoTranscript?.subtitles.subtitles[0]
    );

    return {
      title: videoDetails?.title,
      description: videoDetails?.description,
      duration: Number(videoDetails?.lengthSeconds),
      thumbnails: videoDetails?.thumbnail,
      transcript: parsedTranscript,
    };
  } catch (error) {
    console.error("Error en getVideoDetails:", error);
    return {
      title: "Video sin título",
      description: "",
      duration: 0,
      thumbnails: [],
      transcript: [],
    };
  }
}

interface Options {
  method: string;
  url?: string;
  params: { id: string };
  headers: {
    "x-rapidapi-key": string | undefined;
    "x-rapidapi-host": string | undefined;
  };
}

export async function CheckVideoDetails(options: Options) {
  try {
    const response: {
      data: ResponseVideoDetailsFastApi;
    } = await axios.request(options);
    const data = response.data;

    if (!data || !data.lengthSeconds) {
      throw new Error("Failed to get video length");
    }

    if (!data.subtitles.subtitles[0]) {
      throw new Error("Failed to get video subtitles");
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getVideoTranscript(options: Options) {
  try {
    const response: {
      data: ResponseVideoDetailsFastApi;
    } = await axios.request(options);
    return response.data;
  } catch (error) {}
}

export async function parseXMLContent(xmlContentLink?: {
  url: string;
  languageName: string;
  languageCode: string;
  isTranslatable: boolean;
}): Promise<
  | {
      text: string;
      start: number;
    }[]
  | null
> {
  if (!xmlContentLink) {
    throw new Error("Failed to get video subtitles");
  }

  try {
    const stringToParse = await axios.get(xmlContentLink.url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(stringToParse.data, "application/xml");
    const textElements = doc.getElementsByTagName("text");
    const results = [];

    for (let i = 0; i < textElements.length; i++) {
      /* 
      tiene esta forma <text start="46.32" dur="7.399">crear una lista de nombres mejores y así</text> */

      const textContent = textElements[i].textContent;
      const startTimeStamp = Number(textElements[i].getAttribute("start"));
      const duration = Number(textElements[i].getAttribute("dur"));

      if (textContent && startTimeStamp) {
        results.push({
          text: textContent,
          start: startTimeStamp,
          duration,
        });
      }
    }

    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
