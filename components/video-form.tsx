"use client";
import { processVideo } from "@/actions/ai";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { readStreamableValue } from "ai/rsc";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

type VideoFormProps = {
	setTimeline: (timeline: string) => void;
};

export default function VideoForm({ setTimeline }: VideoFormProps) {
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Card className="mb-8 p-6">
			<form
				onSubmit={async () => {
					const { object } = await processVideo("Messages during finals week.");

					for await (const partialObject of readStreamableValue(object)) {
						if (partialObject) {
							setTimeline(JSON.stringify(partialObject.notifications, null, 2));
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
					{isLoading ? "Processing..." : "Generate Timeline"}
				</Button>
			</form>
		</Card>
	);
}
