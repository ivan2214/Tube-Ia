"use client";

import { create } from "zustand";
import type { TimelineEntry } from "@/entities/video/schemas/video";

interface VideoStore {
  videoId: string | null;
  videoTitle: string;
  timelines: TimelineEntry[] | null;
  transcript: string;
  setVideoId: (id: string) => void;
  setVideoTitle: (title: string) => void;
  setTimelines: (timelines: TimelineEntry[]) => void;
  setTranscript: (transcript: string) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videoId: null,
  videoTitle: "YouTube Video",
  timelines: null,
  transcript: "",
  setVideoId: (id) => set({ videoId: id }),
  setVideoTitle: (title) => set({ videoTitle: title }),
  setTimelines: (timelines) => set({ timelines }),
  setTranscript: (transcript) => set({ transcript }),
}));
