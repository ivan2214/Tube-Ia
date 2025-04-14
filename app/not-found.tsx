import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { HelpCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-extrabold text-9xl text-primary tracking-tighter">
        404
      </h1>

      <div className="mx-auto mt-8 max-w-md">
        <h2 className="mb-4 font-bold text-3xl">Página no encontrada</h2>

        <p className="mb-8 text-muted-foreground">
          Lo sentimos, la página que estás buscando no existe o ha sido movida a
          otra ubicación.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2" />
              Volver al inicio
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/contact">
              <HelpCircle className="mr-2" />
              Contactar soporte
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <div className="relative mx-auto w-full max-w-lg">
          <div className="-left-4 absolute top-0 h-72 w-72 animate-blob rounded-full bg-primary/5 opacity-70 mix-blend-multiply blur-xl filter" />
          <div className="-right-4 animation-delay-2000 absolute top-0 h-72 w-72 animate-blob rounded-full bg-secondary/5 opacity-70 mix-blend-multiply blur-xl filter" />
          <div className="-bottom-8 animation-delay-4000 absolute left-20 h-72 w-72 animate-blob rounded-full bg-primary/5 opacity-70 mix-blend-multiply blur-xl filter" />
          <div className="relative">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="Página no encontrada"
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
