import { VideoSearch } from "@/entities/video/components/video-search";
import { PageHeader } from "@/shared/components/page-header";
import { Brain, Link, MessageCircle } from "lucide-react";
import { getApiKey } from "@/shared/actions/api-key-actions";

const howItWorks = [
  {
    title: "Pegar URL de YouTube",
    description: "Ingresa cualquier URL o ID de video de YouTube para comenzar",
    icon: <Link className="text-red-600" />,
  },
  {
    title: "La IA Genera la Línea de Tiempo",
    description:
      "Nuestra IA analiza el video y crea una línea de tiempo detallada",
    icon: <Brain className="text-red-600" />,
  },
  {
    title: "Chatear sobre el Contenido",
    description: "Haz preguntas y discute el video con nuestro asistente de IA",
    icon: <MessageCircle className="text-red-600" />,
  },
];

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
          <h2 className="mb-4 font-semibold text-2xl">Cómo funciona</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border-2 p-6 shadow-md transition duration-300 hover:shadow-2xl"
              >
                <header className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                  {item.icon}
                </header>
                <h3 className="mb-2 font-medium">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
