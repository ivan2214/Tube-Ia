"use client";

import { create } from "zustand";
import type { TimelineEntry } from "@/schemas/video";

interface VideoStore {
  videoId: string | null;
  timelines: TimelineEntry[] | null;
  transcript: string;
  setVideoId: (id: string) => void;
  setTimelines: (timelines: TimelineEntry[]) => void;
  setTranscript: (transcript: string) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videoId: null,
  timelines: null,
  transcript: "",
  setVideoId: (id) => set({ videoId: id }),
  setTimelines: (timelines) => set({ timelines }),
  setTranscript: (transcript) => set({ transcript }),
}));
