import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { db } from "@/db";
import { ArrowLeft, Download, Trash, Video } from "lucide-react";
import { notFound } from "next/navigation";
import type { Message } from "ai";

// Esta página mostraría los detalles de un chat específico
export const metadata = {
  title: "Detalle de Chat | YouTube AI Analyzer",
  description: "Detalles y mensajes de un chat específico.",
};

type Params = Promise<{ id: string }>;

export default async function ChatDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const chatData = await db.chat.findUnique({
    where: {
      id,
    },
    include: {
      video: {
        include: {
          history: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!chatData) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Detalle del Chat</h2>
          <p className="text-muted-foreground">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2" />
            Exportar chat
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2" />
            Eliminar chat
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Información del Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-1 font-medium text-sm">Video</h3>
              <p className="text-sm">{chatData.video?.title}</p>
              <a
                href={chatData.video?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs hover:underline"
              >
                Ver en YouTube
              </a>
            </div>

            <div>
              <h3 className="mb-1 font-medium text-sm">Usuario</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={
                      chatData.video?.history.user.image || "/placeholder.svg"
                    }
                    alt={chatData.video?.history.user.name || ""}
                  />
                  <AvatarFallback>
                    {chatData.video?.history?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{chatData.video?.history.user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {chatData.video?.history.user.email}
                  </p>
                </div>
              </div>
              <Button variant="link" asChild className="mt-1 h-auto p-0">
                <Link href={`/admin/users/${chatData.video?.history.user.id}`}>
                  Ver perfil completo
                </Link>
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Creado</span>
                <span className="text-sm">
                  {new Date(chatData.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Último mensaje
                </span>
                <span className="text-sm">
                  {new Date(chatData.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Total mensajes
                </span>
                <Badge variant="outline">
                  {chatData.messages?.toLocaleString().length}
                </Badge>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/videos/${chatData.videoId}`}>
                  <Video className="mr-2" />
                  Ver detalles del video
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Conversación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {JSON.parse(chatData.messages?.toString() || "").map(
                (message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.createdAt?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/chats">
            <ArrowLeft className="mr-2" />
            Volver a la lista
          </Link>
        </Button>
      </div>
    </div>
  );
}
