import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Info } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Cómo obtener una API Key | YouTube AI Analyzer",
  description:
    "Guía paso a paso para obtener una API Key de Google para usar con YouTube AI Analyzer.",
};

export default function HowToGetApiKeyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-center font-bold text-4xl">
        Cómo obtener una API Key de Google
      </h1>

      <div className="space-y-8">
        <section>
          <p className="mb-6 text-lg">
            Para utilizar todas las funcionalidades de YouTube AI Analyzer,
            necesitarás una API Key de Google. Esta clave te permitirá acceder a
            la API de YouTube y a los servicios de IA de Google. Sigue los pasos
            a continuación para obtener tu propia API Key.
          </p>

          <div className="mb-6 rounded-lg bg-muted p-4">
            <div className="flex items-start gap-3">
              <Info className="mb-1" />
              <p>
                <strong>Nota importante:</strong> Necesitarás una cuenta de
                Google y una tarjeta de crédito para configurar una cuenta de
                Google Cloud Platform. Google ofrece $300 en créditos gratuitos
                para nuevos usuarios, lo que es más que suficiente para un uso
                personal de nuestra aplicación.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-semibold text-2xl">Guía paso a paso</h2>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    1
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      Crear una cuenta de Google Cloud Platform
                    </h3>
                    <p>
                      Visita la{" "}
                      <a
                        href="https://cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        consola de Google Cloud Platform
                      </a>{" "}
                      y crea una cuenta si aún no tienes una. Sigue las
                      instrucciones para configurar tu cuenta y proporcionar la
                      información de facturación.
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Google Cloud Platform Console"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    2
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      Crear un nuevo proyecto
                    </h3>
                    <p>
                      En la consola de GCP, haz clic en el selector de proyectos
                      en la parte superior de la página y selecciona "Nuevo
                      proyecto". Dale un nombre a tu proyecto y haz clic en
                      "Crear".
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Crear nuevo proyecto en GCP"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    3
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      Habilitar las APIs necesarias
                    </h3>
                    <p>
                      Ve a "APIs y servicios" {">"} "Biblioteca" y busca las
                      siguientes APIs para habilitarlas:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>YouTube Data API v3</li>
                      <li>Google AI API</li>
                      <li>Cloud Speech-to-Text API</li>
                    </ul>
                    <p>Haz clic en cada API y luego en el botón "Habilitar".</p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Habilitar APIs en GCP"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    4
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      Crear credenciales
                    </h3>
                    <p>
                      Ve a "APIs y servicios" {">"} "Credenciales" y haz clic en
                      "Crear credenciales" {">"} "Clave de API".
                    </p>
                    <p>
                      Google generará una nueva clave de API. Cópiala y guárdala
                      en un lugar seguro.
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Crear credenciales en GCP"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    5
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      Restringir tu API Key (recomendado)
                    </h3>
                    <p>
                      Por seguridad, es recomendable restringir tu API Key. Haz
                      clic en la clave recién creada y luego en "Editar".
                    </p>
                    <p>
                      En "Restricciones de API", selecciona las APIs que
                      habilitaste anteriormente. En "Restricciones de
                      aplicación", puedes limitar el uso de la clave a dominios
                      o direcciones IP específicas.
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg?height=300&width=600"
                        alt="Restringir API Key en GCP"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    6
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      Usar tu API Key en YouTube AI Analyzer
                    </h3>
                    <p>
                      Una vez que tengas tu API Key, inicia sesión en tu cuenta
                      de YouTube AI Analyzer y ve a la sección de configuración
                      de tu perfil. Allí encontrarás un campo para ingresar tu
                      API Key.
                    </p>
                    <p>
                      Después de guardar tu API Key, podrás disfrutar de todas
                      las funcionalidades de nuestra aplicación.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-lg bg-muted p-6">
          <h2 className="mb-4 font-semibold text-2xl">¿Necesitas ayuda?</h2>
          <p className="mb-4">
            Si tienes problemas para obtener tu API Key o configurarla en
            nuestra aplicación, no dudes en contactarnos. Estamos aquí para
            ayudarte.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/contact">Contactar soporte</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/faq">Ver preguntas frecuentes</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
