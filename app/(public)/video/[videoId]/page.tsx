import { notFound, redirect } from "next/navigation";
import { VideoContent } from "./components/video-content";
import { getCurrentUser } from "@/shared/hooks/current-user";

type Params = Promise<{
  videoId: string;
} | null>;

export default async function VideoPage({ params }: { params: Params }) {
  const { videoId } = (await params) || {};

  if (!videoId) {
    return notFound();
  }

  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    return redirect("/?auth=signin");
  }

  return <VideoContent videoId={videoId} />;
}
