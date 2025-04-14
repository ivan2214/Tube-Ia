import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mail, Phone, MapPin, Twitter, Github, Linkedin } from "lucide-react";

export const metadata = {
  title: "Contacto | YouTube AI Analyzer",
  description:
    "Ponte en contacto con nosotros para cualquier consulta sobre nuestra aplicación de análisis de videos con IA.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-center font-bold text-4xl">Contacto</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-semibold text-2xl">
            Información de Contacto
          </h2>
          <p className="mb-4">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="lucide lucide-mail" />
              <span>soporte@youtubeaianalyzer.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="lucide lucide-phone" />
              <span>+34 912 345 678</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="lucide lucide-map-pin" />
              <span>Calle Innovación, 123, Madrid, España</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 font-semibold text-xl">Síguenos</h3>
            <div className="flex gap-4">
              <a href="/" className="transition-colors hover:text-primary">
                <Twitter className="lucide lucide-twitter" />
              </a>
              <a href="/" className="transition-colors hover:text-primary">
                <Github className="lucide lucide-github" />
              </a>
              <a href="/" className="transition-colors hover:text-primary">
                <Linkedin className="lucide lucide-linkedin" />
              </a>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Envíanos un mensaje</CardTitle>
            <CardDescription>
              Completa el formulario y te responderemos lo antes posible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-medium text-sm">
                    Nombre
                  </label>
                  <Input id="name" placeholder="Tu nombre" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-medium text-sm">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="font-medium text-sm">
                    Asunto
                  </label>
                  <Input id="subject" placeholder="Asunto de tu mensaje" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="font-medium text-sm">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Enviar mensaje
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
