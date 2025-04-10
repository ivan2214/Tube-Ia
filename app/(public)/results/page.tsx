import { getTimelineResults } from "@/actions/ai";
import Timeline from "@/components/time-line";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ResultsPage() {
	const { entries, videoId } = await getTimelineResults();

	if (!entries.length || !videoId) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-10 text-center">
				<h1 className="mb-6 font-bold text-3xl">No Results Found</h1>
				<p className="mb-6">Please generate a timeline first.</p>
				<Link href="/">
					<Button>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Home
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 py-10">
			<div className="mb-6 flex items-center">
				<Link href="/">
					<Button variant="outline" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</Link>
				<h1 className="ml-4 font-bold text-3xl">Timeline Results</h1>
			</div>

			{videoId && (
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
			)}

			<Timeline entries={entries} videoId={videoId} />
		</div>
	);
}
