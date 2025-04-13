import { notFound } from "next/navigation";
import { VideoContent } from "./components/video-content";

type Params = Promise<{
  videoId: string;
} | null>;

export default async function VideoPage({ params }: { params: Params }) {
  const { videoId } = (await params) || {};

  if (!videoId) {
    return notFound();
  }

  return <VideoContent videoId={videoId} />;
}
