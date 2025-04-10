"use client";
import { processVideo } from "@/actions/ai";
import Timeline from "@/components/time-line";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TimelineEntry } from "@/schemas/video";
import { readStreamableValue } from "ai/rsc";
import { useState } from "react";

export const maxDuration = 30;

export default function Home() {
  const [timeLines, setTimelines] = useState<TimelineEntry[] | null>(null);
  const [url, setUrl] = useState(
    "https://www.youtube.com/watch?v=pJd36C88vbQ&t=4s"
  );

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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const { object } = await processVideo(url);

            for await (const partialObject of readStreamableValue(object)) {
              console.log(partialObject);

              if (partialObject) {
                setTimelines(partialObject);
              }
            }
          }}
          className="space-y-4"
        >
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
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">
            Generate Timeline
          </Button>
        </form>
      </Card>
      {timeLines && timeLines?.length > 0 && (
        <Timeline entries={timeLines} videoId={url} />
      )}
    </div>
  );
}
