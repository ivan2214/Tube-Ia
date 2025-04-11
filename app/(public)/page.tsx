"use client";
import { processVideo } from "@/actions/ai";
import Timeline from "@/components/time-line";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TimelineEntry } from "@/schemas/video";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { readStreamableValue } from "ai/rsc";
import { useRef, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

export const maxDuration = 30;

export default function Home() {
  const [timeLines, setTimelines] = useState<TimelineEntry[] | null>(null);
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [second, setSecond] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { object, videoId } = await processVideo(url);
      setVideoId(videoId);

      // Reset timeline before streaming new results
      setTimelines([]);

      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          // hacer scroll al ultimo recibido automaticamente que sera el que mas abajo este :

          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }

          setTimelines(partialObject);
        }
      }
    } catch (err) {
      console.error("Error processing video:", err);
      setError(err instanceof Error ? err.message : "Failed to process video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecondChange = (second: number) => {
    setSecond(second);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-center font-bold text-3xl">
        YouTube Video Timeline Generator
      </h1>
      <p className="mb-8 text-center text-gray-600">
        Enter a YouTube video URL to generate a timeline of topics discussed at
        specific timestamps.
      </p>

      <Card className="mb-8 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="font-medium text-sm">
              YouTube Video URL
            </label>
            <Input
              id="url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate Timeline"
            )}
          </Button>
        </form>
      </Card>

      {videoId && timeLines && timeLines.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="mb-6 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
          <Timeline
            containerRef={containerRef}
            videoId={videoId}
            handleSecondChange={handleSecondChange}
            entries={timeLines}
          />
        </section>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-center text-muted-foreground text-sm">
            Analyzing video content and generating timeline...
            <br />
            This may take a minute or two depending on the video length.
          </p>
        </div>
      )}
    </div>
  );
}
