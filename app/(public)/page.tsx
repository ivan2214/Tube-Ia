import VideoAnalysisSection from "@/entities/video/components/video-analysis-section";
import VideoForm from "@/entities/video/components/video-form";

export default function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-center font-bold text-3xl">
        YouTube Video Timeline Generator
      </h1>
      <p className="mb-8 text-center text-gray-600">
        Enter a YouTube video URL to generate a timeline and chat about the
        content.
      </p>

      <VideoForm />
      <VideoAnalysisSection />
    </div>
  );
}
