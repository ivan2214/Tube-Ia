"use client";

import { useState, useRef } from "react";
import { useVideoStore } from "@/store/video-store";
import Timeline from "@/components/time-line";
import YouTubePlayer from "@/components/youtube-player";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function VideoAnalysisSection() {
  const { videoId, timelines, videoTitle } = useVideoStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const handleTimeClick = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  const handlePlayerReady = (player: YT.Player) => {
    playerRef.current = player;
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  if (!videoId || !timelines || timelines.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="mb-4 font-bold text-xl">{videoTitle}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <YouTubePlayer
          videoId={videoId}
          onPlayerReady={handlePlayerReady}
          onTimeUpdate={handleTimeUpdate}
        />
        <Timeline
          containerRef={containerRef}
          entries={timelines}
          onTimeClick={handleTimeClick}
          currentTime={currentTime}
        />
      </div>

      {/* Chat toggle button */}
      <div className="fixed right-6 bottom-6 z-10">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Animated chat panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed right-6 bottom-24 z-10 w-full max-w-md"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <ChatInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
