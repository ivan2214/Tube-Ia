import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TimelineEntry } from "@/schemas/video";

interface TimelineProps {
	entries: TimelineEntry[];
	videoId: string;
}

export default function Timeline({ entries, videoId }: TimelineProps) {
	if (!entries || entries.length === 0) {
		return null;
	}

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const createYouTubeLink = (videoId: string, timestamp: number): string => {
		return `https://www.youtube.com/watch?v=${videoId}&t=${timestamp}s`;
	};

	return (
		<Card className="p-6">
			<h2 className="mb-4 font-bold text-xl">Video Timeline</h2>
			<ScrollArea className="h-[500px] pr-4">
				<div className="space-y-4">
					{entries.map((entry) => (
						<div
							key={entry.timestamp}
							className="relative border-primary border-l-2 pl-4"
						>
							<div className="-left-[7px] absolute top-1 h-3 w-3 rounded-full bg-primary" />
							<a
								href={createYouTubeLink(videoId, entry.timestamp)}
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-primary hover:underline"
							>
								{formatTime(entry.timestamp)}
							</a>
							<p className="mt-1">{entry.topic}</p>
						</div>
					))}
				</div>
			</ScrollArea>
		</Card>
	);
}
