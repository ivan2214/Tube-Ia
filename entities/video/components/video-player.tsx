"use client";

import { useEffect, useRef, useCallback } from "react";
import { Card } from "@/shared/components/ui/card";

interface VideoPlayerProps {
  videoId: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoPlayer({
  videoId,
  currentTime,
  onTimeUpdate,
}: VideoPlayerProps) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const playerInstanceRef = useRef<any>(null);
  const lastTimeUpdateRef = useRef<number>(0);

  // Definir funciones de callback fuera del efecto para evitar recreaciones
  const initPlayer = useCallback(() => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.destroy();
    }

    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          // Player is ready
        },
        onStateChange: (event: { data: number }) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            // Start time update interval when playing
            const interval = setInterval(() => {
              if (playerInstanceRef.current?.getCurrentTime) {
                const currentTime = playerInstanceRef.current.getCurrentTime();
                if (Math.abs(currentTime - lastTimeUpdateRef.current) > 0.5) {
                  lastTimeUpdateRef.current = currentTime;
                  onTimeUpdate(currentTime);
                }
              }
            }, 500);

            return () => clearInterval(interval);
          }
        },
      },
    });
  }, [videoId, onTimeUpdate]);

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [videoId]);

  // Handle seeking when currentTime prop changes
  useEffect(() => {
    if (
      playerInstanceRef.current?.seekTo &&
      Math.abs(currentTime - lastTimeUpdateRef.current) > 1
    ) {
      playerInstanceRef.current.seekTo(currentTime, true);
      lastTimeUpdateRef.current = currentTime;
    }
  }, [currentTime]);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-100" ref={containerRef}>
        <div ref={playerRef} className="h-full w-full" />
      </div>
    </Card>
  );
}
