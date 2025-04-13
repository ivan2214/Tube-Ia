"use server";

import type { HistoryEntry } from "@/entities/history/types";

// In a real application, you would use a database to store history
// For this example, we'll use localStorage on the client side

let mockHistory: HistoryEntry[] = [];

export async function saveToHistory(entry: {
  videoId: string;
  title: string;
  timestamp: string;
}): Promise<void> {
  const newEntry: HistoryEntry = {
    id: Math.random().toString(36).substring(2, 9),
    ...entry,
  };

  // In a real app, you would save to a database here
  mockHistory = [
    newEntry,
    ...mockHistory.filter((h) => h.videoId !== entry.videoId),
  ];
}

export async function getHistory(): Promise<HistoryEntry[]> {
  // In a real app, you would fetch from a database here
  return mockHistory;
}

export async function clearHistory(): Promise<void> {
  // In a real app, you would clear from a database here
  mockHistory = [];
}
