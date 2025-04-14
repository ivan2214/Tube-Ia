"use server";

import { db } from "@/db";
import type { HistoryEntry } from "@/entities/history/types";
import type { TimelineEntry } from "@/entities/timeline/types";
import { getCurrentUser } from "@/shared/hooks/current-user";

export async function saveToHistory(entry: {
  videoId: string;
  title: string;
  timestamp: string;
  timeline?: TimelineEntry[];
}): Promise<void> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser?.id) {
      console.log("User not authenticated");
      return;
    }

    // Check if history entry already exists
    const existingHistory = await db.history.findUnique({
      where: {
        userId_videoId: {
          userId: currentUser.id,
          videoId: entry.videoId,
        },
      },
    });

    if (existingHistory) {
      // Update existing history
      await db.history.update({
        where: {
          id: existingHistory.id,
        },
        data: {
          title: entry.title,
          timestamp: new Date(entry.timestamp),
        },
      });

      // If timeline is provided, update it
      if (entry.timeline && entry.timeline.length > 0) {
        // Delete existing timeline entries
        await db.timeline.deleteMany({
          where: {
            historyId: existingHistory.id,
          },
        });

        // Create new timeline entries
        await db.timeline.createMany({
          data: entry.timeline.map((item) => ({
            historyId: existingHistory.id,
            time: item.time,
            title: item.title,
            description: item.description,
          })),
        });
      }
    } else {
      // Create new history entry
      const newHistory = await db.history.create({
        data: {
          videoId: entry.videoId,
          title: entry.title,
          timestamp: new Date(entry.timestamp),
          userId: currentUser.id,
        },
      });

      // If timeline is provided, create timeline entries
      if (entry.timeline && entry.timeline.length > 0) {
        await db.timeline.createMany({
          data: entry.timeline.map((item) => ({
            historyId: newHistory.id,
            time: item.time,
            title: item.title,
            description: item.description,
          })),
        });
      }
    }
  } catch (error) {
    console.error("Error saving to history:", error);
  }
}

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const history = await db.history.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return history.map((item) => ({
      id: item.id,
      videoId: item.videoId,
      title: item.title,
      timestamp: item.timestamp.toISOString(),
    }));
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
}

export async function getHistoryWithTimeline(videoId: string): Promise<{
  history: HistoryEntry | null;
  timeline: TimelineEntry[];
}> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return { history: null, timeline: [] };
    }

    const history = await db.history.findUnique({
      where: {
        userId_videoId: {
          userId: currentUser.id,
          videoId,
        },
      },
    });

    if (!history) {
      return { history: null, timeline: [] };
    }

    const timeline = await db.timeline.findMany({
      where: {
        historyId: history.id,
      },
      orderBy: {
        time: "asc",
      },
    });

    return {
      history: {
        id: history.id,
        videoId: history.videoId,
        title: history.title,
        timestamp: history.timestamp.toISOString(),
      },
      timeline: timeline.map((item) => ({
        time: item.time,
        title: item.title,
        description: item.description,
      })),
    };
  } catch (error) {
    console.error("Error getting history with timeline:", error);
    return { history: null, timeline: [] };
  }
}

export async function clearHistory(): Promise<void> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return;
    }

    // Delete all history entries for the user
    await db.history.deleteMany({
      where: {
        userId: currentUser.id,
      },
    });
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}
