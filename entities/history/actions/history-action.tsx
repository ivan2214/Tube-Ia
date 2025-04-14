"use server";

import type { NewVideo } from "@/app/(public)/video/[videoId]/components/video-content";
import { db } from "@/db";
import type { VideoWithRelations } from "@/entities/video/actions/video-db";

import { getCurrentUser } from "@/shared/hooks/current-user";

export async function saveToHistory({
  id,
  timeline,
  title,
  details,
  duration,
  url,
}: NewVideo) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Inicia sesion");
    }

    // verificamos si el usuario tiene creado un historial

    const existingHistory = await db.history.findFirst({
      where: {
        userId: currentUser.id,
        videos: {
          some: {
            id: id,
          },
        },
      },
    });

    console.log("existingHistory", existingHistory);

    console.log("values", { id, timeline, title, details, duration, url });

    if (
      !existingHistory &&
      id &&
      timeline &&
      title &&
      details &&
      duration &&
      url
    ) {
      // si no existe creamos uno nuevo
      console.log("Creando historial");

      await db.history.create({
        data: {
          userId: currentUser.id,
          videos: {
            create: {
              id: id,
              title,
              timeline: {
                create: timeline || [],
              },
              details,
              duration,
              url,
            },
          },
          title,
        },
      });
    }
  } catch (error) {
    console.log("Error", error);

    console.error("Error saving to history:", error);
  }
}

export interface HistoryWithRelations extends History {
  videos: VideoWithRelations[];
}

export async function getHistory() {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const history = await db.history.findUnique({
      where: {
        userId: currentUser.id,
      },
      include: {
        videos: {
          include: {
            timeline: true,
            chat: true,
          },
        },
      },
    });
    if (!history) {
      return null;
    }

    return history;
  } catch (error) {
    console.error("Error getting history:", error);
    return null;
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
