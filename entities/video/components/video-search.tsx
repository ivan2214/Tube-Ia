"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { extractVideoId } from "@/shared/utils/youtube-utils";
import { redirect } from "next/navigation";

interface VideoSearchProps {
  hasApiKey: boolean;
}

export function VideoSearch({ hasApiKey }: VideoSearchProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasApiKey) {
      setError("Please add your OpenAI API key to continue");
      return;
    }

    setError("");

    const videoId = extractVideoId(input);
    if (!videoId) {
      setError("Please enter a valid YouTube URL or video ID");
      return;
    }

    onSubmit(videoId);
  };

  const onSubmit = (videoId: string) => {
    redirect(`/video/${videoId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze a YouTube Video</CardTitle>
        <CardDescription>
          Enter a YouTube video URL or ID to generate a timeline and chat about
          its content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={error ? "border-red-500" : ""}
              disabled={!hasApiKey}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button type="submit" className="w-full">
            Generate Timeline
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
