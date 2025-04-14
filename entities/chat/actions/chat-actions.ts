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
}) {
  try {
    const { currentUser } = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
}

export async function createChat(historyId: string) {
  try {
    const newChat = await db.chat.create({
      data: {
        messages: JSON.stringify([]),
        historyId,
      },
    });
    return newChat;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export async function updateChat(chatId: string, messages: Message[]) {
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
      include: {
        history: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!chat || chat.history?.userId !== currentUser.id) {
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
