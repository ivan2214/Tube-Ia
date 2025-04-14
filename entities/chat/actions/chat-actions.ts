"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { getCurrentUser } from "@/shared/hooks/current-user";
import type { Message } from "@ai-sdk/react";

export async function saveChat({
  messages,
  videoId,
  chatId,
}: {
  messages: Message[];
  videoId?: string;
  chatId?: string;
}) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        videoId,
      },
    });

    // si ya existe un chat para el video, lo actualizamos
    if (chat && chat.videoId === videoId) {
      const updatedChat = await updateChat(chat.id, messages, videoId);
      return updatedChat;
    }

    // si no existe un chat para el video, lo creamos
    if (!videoId) {
      throw new Error("Video ID is required");
    }
    const newChat = await createChat(videoId);
    return newChat;
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
}

export async function createChat(videoId: string) {
  try {
    const newChat = await db.chat.create({
      data: {
        messages: JSON.stringify([]),
        video: {
          connect: {
            id: videoId,
          },
        },
      },
    });
    return newChat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export async function updateChat(
  chatId: string,
  messages: Message[],
  videoId: string
) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });
    if (!chat) {
      throw new Error("Chat not found");
    }

    const updatedChat = await db.chat.update({
      where: {
        id: chatId,
        videoId,
      },
      data: {
        messages: JSON.stringify(messages),
      },
    });
    return updatedChat;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
}

export async function deleteChat(chatId: string) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        video: {
          select: {
            history: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!chat || chat.video?.history?.userId !== currentUser.id) {
      throw new Error("Unauthorized");
    }

    await db.chat.delete({
      where: {
        id: chatId,
      },
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}

export async function getChat(chatId: string): Promise<{
  messages: Message[];
  videoId?: string;
} | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      return null;
    }

    return {
      messages: chat.messages as unknown as Message[],
    };
  } catch (error) {
    console.error("Error getting chat:", error);
    return null;
  }
}
