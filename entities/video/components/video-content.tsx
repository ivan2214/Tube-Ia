"use client";

// Este componente maneja la visualización y funcionalidad principal del reproductor de video
// Importamos los hooks necesarios de React y componentes personalizados
import { useEffect, useState, useCallback } from "react";
import { VideoPlayer } from "@/entities/video/components/video-player";
import { VideoTimeline } from "@/entities/video/components/video-timeline";
import { VideoChat } from "@/entities/video/components/video-chat";
import { generateVideoTimeline } from "@/entities/timeline/actions/timeline-actions";

// Importamos componentes de UI y tipos necesarios
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";
import { readStreamableValue } from "ai/rsc";
import {
  getVideoById,
  type VideoWithRelations,
} from "@/entities/video/actions/video-db";
import type { TimelineEntry } from "@/entities/timeline/types";
import { saveToHistory } from "@/entities/history/actions/history-action";
import { generateId, type Message } from "ai";
import type { User } from "@/prisma/generated";

// Definimos la interfaz para las props del componente
interface VideoContentProps {
  videoId: string;
  currentUser: User;
}

// Componente principal que muestra el contenido del video

export interface NewVideo {
  id?: string;
  title?: string;
  details?: string;
  duration?: number;
  timeline?: TimelineEntry[] | null;
  url?: string;
  thumbnail?: string;
}

export const VideoContent: React.FC<VideoContentProps> = ({
  videoId,
  currentUser,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setTimeline] = useState<TimelineEntry[] | null>(null);
  const [existingVideo, setExistingVideo] = useState<VideoWithRelations | null>(
    null
  );
  const [newVideo, setNewVideo] = useState<NewVideo | null>(null);
  const [finished, setFinished] = useState(false);

  // Efecto para cargar los datos del video al montar el componente
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!videoId) {
        toast.error("Error", {
          description: "El id del video es requerido.",
        });
        return;
      }

      // Primero verificamos si el video existe en el historial
      const { video: existingVideo } = await getVideoById(videoId);

      if (existingVideo) {
        setExistingVideo(existingVideo);
        setIsLoading(false);
      } else {
        // Si no existe, generamos una nueva línea de tiempo
        const { object, error, details, duration, title, thumbnail } =
          await generateVideoTimeline(videoId);

        if (error || !object) {
          toast.error("Error", {
            description:
              "Error al generar la linea del tiempo. Intentar de nuevo.",
          });
          return;
        }

        if (details && duration && title && thumbnail && videoId) {
          const url = `https://www.youtube.com/watch?v=${videoId}`;

          console.log({
            url,
          });

          setNewVideo({
            id: videoId,
            title,
            details,
            duration,
            url,
            thumbnail,
          });
        }

        // Procesamos la respuesta streaming
        for await (const partialObject of readStreamableValue(object)) {
          if (partialObject.timeline) {
            setIsLoading(false);
            setTimeline(partialObject.timeline);
            setNewVideo((prev) => ({
              ...prev,
              timeline: partialObject.timeline,
            }));
          }
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: "Error al generar la linea del tiempo. Intentar de nuevo.",
      });
    } finally {
      setFinished(true);
    }
  }, [videoId]);

  const handleSaveToHistory = useCallback(async (newVideo: NewVideo) => {
    await saveToHistory(newVideo);
  }, []);

  // Efecto para manejar la actualización de la línea de tiempo
  useEffect(() => {
    if (finished && !existingVideo && newVideo) {
      handleSaveToHistory(newVideo);
    }
  }, [finished, existingVideo, newVideo, handleSaveToHistory]);

  useEffect(() => {
    fetchData();
  }, [videoId, fetchData]);

  // Manejadores de eventos para la línea de tiempo
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleTimelineClick = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Renderizado del componente
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título del video */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="mb-2 h-10 w-3/4" />
        ) : (
          <h1 className="font-bold text-2xl">{newVideo?.title}</h1>
        )}
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna principal con reproductor y pestañas */}
        <div className="lg:col-span-2">
          <VideoPlayer
            videoId={videoId}
            currentTime={currentTime}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Pestañas de Timeline y Chat */}
          <div className="mt-6">
            <Tabs defaultValue="timeline">
              <TabsList className="w-full">
                <TabsTrigger value="timeline" className="flex-1">
                  Línea de tiempo
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i.toString()} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <VideoTimeline
                    timeline={existingVideo?.timeline || newVideo?.timeline}
                    currentTime={currentTime}
                    onTimeClick={handleTimelineClick}
                  />
                )}
              </TabsContent>
              <TabsContent value="chat" className="mt-4">
                <VideoChat
                  currentUser={currentUser}
                  video={existingVideo || newVideo}
                  chatId={existingVideo?.chat?.id || generateId()}
                  initialMessages={
                    existingVideo?.chat?.messages as unknown as Message[]
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Barra lateral con línea de tiempo compacta */}
        <div className="hidden lg:block">
          <div className="rounded-lg p-4 shadow-md">
            <h2 className="mb-4 font-semibold text-lg">
              Linea de tiempo del Video
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i.toString()} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <VideoTimeline
                timeline={existingVideo?.timeline || newVideo?.timeline}
                currentTime={currentTime}
                onTimeClick={handleTimelineClick}
                compact
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
