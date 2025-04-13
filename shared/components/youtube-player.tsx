"use client";

import { Card } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
  videoId: string;
  onPlayerReady?: (player: YT.Player) => void;
  onTimeUpdate?: (time: number) => void;
}

export default function YouTubePlayer({
  videoId,
  onPlayerReady,
  onTimeUpdate,
}: YouTubePlayerProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<YT.Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube API
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Only load the API once
    if (!document.getElementById("youtube-api-script")) {
      const tag = document.createElement("script");
      tag.id = "youtube-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initializePlayer = () => {
      if (playerContainerRef.current && window.YT && window.YT.Player) {
        createPlayer();
      } else {
        // If YT is not available yet, wait for it
        window.onYouTubeIframeAPIReady = createPlayer;
      }
    };

    // Try to initialize immediately or wait for API
    if (window.YT?.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      // Clean up
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [videoId]);

  const createPlayer = () => {
    if (!playerContainerRef.current) return;

    // Clear existing player if any
    if (playerInstanceRef.current) {
      playerInstanceRef.current.destroy();
    }

    // Clear any existing interval
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }

    // Create a unique ID for the player element
    const playerId = `youtube-player-${videoId}`;

    // Create a div element for the player
    const playerElement = document.createElement("div");
    playerElement.id = playerId;

    // Clear the container and append the player element
    playerContainerRef.current.innerHTML = "";
    playerContainerRef.current.appendChild(playerElement);

    // Create the player
    playerInstanceRef.current = new window.YT.Player(playerId, {
      videoId: videoId,
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        enablejsapi: 1,
      },
      events: {
        onReady: (event) => {
          setIsLoading(false);
          if (onPlayerReady) {
            onPlayerReady(event.target);
          }
        },
        onStateChange: (event) => {
          // Start time update interval when playing
          if (event.data === window.YT.PlayerState.PLAYING) {
            if (timeUpdateIntervalRef.current) {
              clearInterval(timeUpdateIntervalRef.current);
            }

            timeUpdateIntervalRef.current = setInterval(() => {
              if (playerInstanceRef.current && onTimeUpdate) {
                const currentTime = Math.floor(
                  playerInstanceRef.current.getCurrentTime()
                );
                onTimeUpdate(currentTime);
              }
            }, 1000);
          } else if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED
          ) {
            // Clear interval when paused or ended
            if (timeUpdateIntervalRef.current) {
              clearInterval(timeUpdateIntervalRef.current);
            }
          }
        },
      },
    });
  };

  return (
    <Card className="relative col-span-2 aspect-video overflow-hidden">
      <div ref={playerContainerRef} className="h-full w-full">
        {/* Player will be created here */}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </Card>
  );
}
