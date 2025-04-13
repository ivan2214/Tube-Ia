"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getHistory,
  clearHistory,
} from "@/entities/history/actions/history-action";
import type { HistoryEntry } from "@/entities/history/types";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatDistanceToNow } from "@/shared/utils/date-utils";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const historyData = await getHistory();
        setHistory(historyData);
      } catch (error) {
        toast.error("Error", {
          description: "Failed to load history",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      toast.success("Success", {
        description: "History cleared successfully",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to clear history",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="History"
        description="Your previously analyzed videos"
        action={
          <Button
            variant="outline"
            onClick={handleClearHistory}
            disabled={isLoading || history.length === 0}
          >
            Clear History
          </Button>
        }
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i.toString()} className="h-48 w-full" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="mb-2 font-medium text-lg">No history found</h3>
            <p className="mb-6 text-gray-500">
              You haven't analyzed any videos yet
            </p>
            <Link href="/">
              <Button>Analyze a Video</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {history.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-lg">
                    {entry.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="mb-3 aspect-video overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={`https://img.youtube.com/vi/${entry.videoId}/mqdefault.jpg`}
                      alt={entry.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(entry.timestamp))} ago
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/video/${entry.videoId}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Video
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
