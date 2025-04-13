"use client";

import { redirect } from "next/navigation";
import { VideoSearch } from "@/entities/video/components/video-search";
import { PageHeader } from "@/shared/components/page-header";
import { Brain, Link, MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="YouTube AI Timeline"
        description="Generate timelines and chat about YouTube videos using AI"
      />

      <div className="mx-auto mt-8 max-w-2xl">
        <VideoSearch
          onSubmit={(videoId) => {
            redirect(`/video/${videoId}`);
          }}
        />

        <div className="mt-12 text-center">
          <h2 className="mb-4 font-semibold text-xl">How it works</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg p-6 shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Link className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-medium">1. Paste YouTube URL</h3>
              <p className="text-gray-600 text-sm">
                Enter any YouTube video URL or ID to get started
              </p>
            </div>

            <div className="rounded-lg p-6 shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Brain className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-medium">2. AI Generates Timeline</h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes the video and creates a detailed timeline
              </p>
            </div>

            <div className="rounded-lg p-6 shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MessageCircle className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-medium">3. Chat About Content</h3>
              <p className="text-gray-600 text-sm">
                Ask questions and discuss the video with our AI assistant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
