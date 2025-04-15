"use server";

import type { NewVideo } from "@/app/(public)/video/[videoId]/components/video-content";
import { db } from "@/db";
import type { VideoWithRelations } from "@/entities/video/actions/video-db";

import { getCurrentUser } from "@/shared/hooks/current-user";
import { revalidatePath } from "next/cache";

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
      },
    });

    let historyId: string | null = null;

    if (!existingHistory) {
      // si no existe creamos uno nuevo

      const history = await db.history.create({
        data: {
          userId: currentUser.id,
        },
      });

      historyId = history.id;
    }

    if (existingHistory) {
      historyId = existingHistory.id;
    }

    // agregar los videos al historial

    if (!historyId) {
      throw new Error("No se pudo crear el historial");
    }

    if (!id || !timeline || !title || !details || !duration || !url) {
      throw new Error("No se pudo crear el video");
    }

    // verificamos si el video ya existe

    const existingVideo = await db.video.findFirst({
      where: {
        id,
      },
    });

    if (existingVideo) {
      throw new Error("Video already exists");
    }

    const video = await db.video.create({
      data: {
        title,
        details,
        duration,
        url,
        timeline: {
          create: timeline,
        },
        history: {
          connect: {
            id: historyId,
          },
        },
      },
    });
  } catch (error) {
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
  } finally {
    revalidatePath("/history");
  }
}
