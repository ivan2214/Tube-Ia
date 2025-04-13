import { VideoSearch } from "@/entities/video/components/video-search";
import { PageHeader } from "@/shared/components/page-header";
import { Brain, Link, MessageCircle } from "lucide-react";
import { getApiKey } from "@/shared/actions/api-key-actions";

export default async function HomePage() {
  const { apiKey } = await getApiKey();
  const hasApiKey = !!apiKey;
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="IA para videos de YouTube"
        description="Genera líneas de tiempo y chatea sobre videos de YouTube usando IA"
      />

      <div className="mx-auto mt-8 max-w-2xl">
        <VideoSearch hasApiKey={hasApiKey} />

        <div className="mt-12 text-center">
          <h2 className="mb-4 font-semibold text-xl">Cómo funciona</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg p-6 shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Link className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-medium">1. Pegar URL de YouTube</h3>
              <p className="text-gray-600 text-sm">
                Ingresa cualquier URL o ID de video de YouTube para comenzar
              </p>
            </div>

            <div className="rounded-lg p-6 shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Brain className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-medium">
                2. La IA Genera la Línea de Tiempo
              </h3>
              <p className="text-gray-600 text-sm">
                Nuestra IA analiza el video y crea una línea de tiempo detallada
              </p>
            </div>

            <div className="rounded-lg p-6 shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MessageCircle className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-medium">3. Chatea Sobre el Contenido</h3>
              <p className="text-gray-600 text-sm">
                Haz preguntas y discute el video con nuestro asistente de IA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
