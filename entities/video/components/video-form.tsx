"use client";

import type React from "react";

import { useVideoStore } from "@/entities/video/store/video-store";
import { processVideo } from "@/shared/actions/ai";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { readStreamableValue } from "ai/rsc";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function VideoForm() {
	const [url, setUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { setVideoId, setTimelines, setTranscript, setVideoTitle } =
		useVideoStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const { object, videoId, transcript, videoTitle } =
				await processVideo(url);
			setVideoId(videoId);
			setTranscript(transcript);
			setVideoTitle(videoTitle || "YouTube Video");

			// Reset timeline before streaming new results
			setTimelines([]);

			for await (const partialObject of readStreamableValue(object)) {
				if (partialObject) {
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

	return (
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
	);
}
