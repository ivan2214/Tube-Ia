import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TimelineSkeleton() {
	return (
		<Card className="p-6">
			<Skeleton className="mb-4 h-7 w-40" />
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={index.toString()}
						className="relative border-gray-200 border-l-2 pl-4"
					>
						<div className="-left-[7px] absolute top-1 h-3 w-3 rounded-full bg-gray-200" />
						<Skeleton className="mb-2 h-5 w-16" />
						<Skeleton className="h-4 w-full max-w-md" />
					</div>
				))}
			</div>
		</Card>
	);
}
