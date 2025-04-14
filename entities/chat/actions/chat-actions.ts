"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { getCurrentUser } from "@/shared/hooks/current-user";
import type { Message } from "@ai-sdk/react";

export async function saveChat({
  messages,
  videoId,
}: {
  messages: Message[];
  videoId?: string;
}): Promise<{ id: string | null }> {
  try {
    console.log("saveChat");

    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    console.log("messages", messages);
    console.log("videoId", videoId);

    let historyId: string | null = null;

    // If videoId is provided, find the history entry
    if (videoId) {
      const history = await db.history.findUnique({
        where: {
          userId_videoId: {
            userId: currentUser.id,
            videoId: videoId,
          },
        },
        select: {
          id: true,
        },
      });

      if (history) {
        historyId = history.id;
      }
    }

    let idChat: string | null = null;

    const existingChat = await db.chat.findFirst({
      where: {
        userId: currentUser.id,
        historyId: historyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingChat) {
      // Update the existing chat
      const updatedChat = await db.chat.update({
        where: {
          id: existingChat.id,
        },
        data: {
          messages: JSON.stringify(messages),
        },
      });
      idChat = updatedChat.id;
    } else {
      // Create a new chat
      const createdChat = await db.chat.create({
        data: {
          userId: currentUser.id,
          messages: JSON.stringify(messages),
          historyId: historyId,
        },
      });
      idChat = createdChat.id;
    }

    return { id: idChat };
  } catch (error) {
    console.error("Error saving chat:", error);
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
        userId: session.user.id,
      },
      include: {
        history: {
          select: {
            videoId: true,
          },
        },
      },
    });

    if (!chat) {
      return null;
    }

    return {
      messages: chat.messages as unknown as Message[],
      videoId: chat.history?.videoId,
    };
  } catch (error) {
    console.error("Error getting chat:", error);
    return null;
  }
}

export async function getChatsByVideoId(videoId: string): Promise<
  {
    id: string;
    messages: Message[];
    createdAt: Date;
  }[]
> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return [];
    }

    const history = await db.history.findUnique({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!history) {
      return [];
    }

    const chats = await db.chat.findMany({
      where: {
        historyId: history.id,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!chats) {
      return [];
    }

    return chats.map((chat) => ({
      id: chat.id,
      messages: chat.messages as unknown as Message[],
      createdAt: chat.createdAt,
    }));
  } catch (error) {
    console.error("Error getting chats by video ID:", error);
    return [];
  }
}
