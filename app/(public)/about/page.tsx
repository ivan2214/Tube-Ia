import { Card } from "@/shared/components/ui/card";
import { BrainCircuit, Lightbulb, Timer } from "lucide-react";

export const metadata = {
  title: "Acerca de | YouTube AI Analyzer",
  description:
    "Conoce más sobre nuestra aplicación de análisis de videos de YouTube con IA.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-center font-bold text-4xl">
        Acerca de YouTube AI Analyzer
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 font-semibold text-2xl">Nuestra Misión</h2>
          <p className="text-lg">
            En YouTube AI Analyzer, nuestra misión es hacer que el contenido de
            video sea más accesible y fácil de navegar. Utilizamos tecnología de
            inteligencia artificial avanzada para analizar videos de YouTube y
            generar automáticamente líneas de tiempo detalladas y resúmenes
            concisos, permitiéndote encontrar exactamente lo que buscas sin
            tener que ver el video completo.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <BrainCircuit className="mb-4" />
              <h3 className="mb-2 font-semibold text-xl">
                Tecnología IA Avanzada
              </h3>
              <p>
                Utilizamos modelos de IA de última generación para analizar y
                comprender el contenido de los videos.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Timer className="mb-4" />
              <h3 className="mb-2 font-semibold text-xl">Ahorro de Tiempo</h3>
              <p>
                Encuentra rápidamente la información que necesitas sin tener que
                ver videos completos.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Lightbulb className="mb-4" />
              <h3 className="mb-2 font-semibold text-xl">
                Comprensión Mejorada
              </h3>
              <p>
                Obtén resúmenes claros y concisos que te ayudan a entender mejor
                el contenido del video.
              </p>
            </div>
          </Card>
        </div>

        <section>
          <h2 className="mb-4 font-semibold text-2xl">Cómo Funciona</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <ol className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Pega el enlace del video",
                    description:
                      "Simplemente copia y pega la URL del video de YouTube que deseas analizar.",
                  },
                  {
                    step: 2,
                    title: "Nuestra IA analiza el contenido",
                    description:
                      "Nuestros algoritmos de IA procesan el audio y el contenido visual del video.",
                  },
                  {
                    step: 3,
                    title: "Recibe resultados detallados",
                    description:
                      "Obtendrás una línea de tiempo interactiva y un resumen completo del video.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* <div className="flex items-center justify-center">
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg shadow-lg">
                <img
                  src="/placeholder.svg?height=270&width=480"
                  alt="Demostración de YouTube AI Analyzer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/80">
                    <Play />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        {/* <section>
          <h2 className="mb-4 font-semibold text-2xl">Nuestro Equipo</h2>
          <p className="mb-6">
            Somos un equipo apasionado de ingenieros, científicos de datos y
            entusiastas de la IA comprometidos con hacer que el contenido de
            video sea más accesible para todos.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                name: "Ana Rodríguez",
                role: "Fundadora & CEO",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Carlos Martínez",
                role: "CTO & Ingeniero de IA",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Elena Gómez",
                role: "Jefa de Producto",
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((member) => (
              <div
                key={member.image}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
}
