import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Bell,
  CalendarClock,
  Code,
  HardHat,
  Home,
  Rocket,
  TestTube,
} from "lucide-react";
import Link from "next/link";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  estimatedCompletion?: string;
  contactLink?: string;
  homeLink?: string;
}

export default function UnderConstruction({
  title = "Página en construcción",
  description = "Estamos trabajando en esta sección. Pronto estará disponible con nuevas funcionalidades.",
  estimatedCompletion = "Próximamente",
  contactLink = "/contact",
  homeLink = "/",
}: UnderConstructionProps) {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HardHat />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <CalendarClock />
                <span>
                  Fecha estimada de finalización: {estimatedCompletion}
                </span>
              </div>

              <div className="relative pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-primary px-2 py-1 font-semibold text-primary-foreground text-xs uppercase">
                      Progreso
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block font-semibold text-primary text-xs">
                      65%
                    </span>
                  </div>
                </div>
                <div className="mb-4 flex h-2 overflow-hidden rounded bg-primary/20 text-xs">
                  <div
                    style={{ width: "65%" }}
                    className="flex flex-col justify-center whitespace-nowrap bg-primary text-center text-white shadow-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="w-full">
              <Link href={homeLink}>
                <Home />
                Volver al inicio
              </Link>
            </Button>

            <Button asChild className="w-full">
              <Link href={contactLink}>
                <Bell className="mr-2" />
                Recibir notificación
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 text-center">
            <Code className="mb-3" />
            <h3 className="font-medium">Desarrollo</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Estamos programando las funcionalidades principales.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <TestTube className="mb-3" />
            <h3 className="font-medium">Pruebas</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Realizando pruebas para garantizar la calidad.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <Rocket className="mb-3" />
            <h3 className="font-medium">Lanzamiento</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Preparando el lanzamiento de la nueva funcionalidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
