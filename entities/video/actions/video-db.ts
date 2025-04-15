"use server";

import { db } from "@/db";
import type { TimelineEntry } from "@/entities/timeline/types";
import type { Chat, Timeline, Video } from "@/prisma/generated";
import { getCurrentUser } from "@/shared/hooks/current-user";

export interface VideoWithRelations extends Video {
  chat?: Chat | null;
  timeline: (Timeline | TimelineEntry)[] | null;
}

export async function getVideoById(
  videoId: string
): Promise<{ video: VideoWithRelations | null }> {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const video = await db.video.findFirst({
      where: {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        history: {
          userId: currentUser.id,
        },
      },
      include: {
        chat: true,
        timeline: true,
      },
    });

    return { video };
  } catch (error) {
    return {
      video: null,
    };
  }
}
