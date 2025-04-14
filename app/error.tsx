"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcionalmente, registra el error en un servicio de análisis de errores
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <AlertTitle className="text-xl">¡Algo salió mal!</AlertTitle>
          <AlertDescription className="mt-2">
            Ha ocurrido un error al procesar tu solicitud. Nuestro equipo ha
            sido notificado.
          </AlertDescription>
        </Alert>

        <div className="mb-6 rounded-lg bg-muted p-6">
          <h3 className="mb-2 font-semibold">Detalles del error:</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            {error.message || "Error desconocido"}
          </p>
          {error.digest && (
            <p className="text-muted-foreground text-xs">
              ID del error:{" "}
              <code className="rounded bg-background px-1 py-0.5">
                {error.digest}
              </code>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={reset} className="flex-1">
            <RefreshCcw className="mr-2" />
            Intentar de nuevo
          </Button>

          <Button variant="outline" asChild className="flex-1">
            <Link href="/">
              <Home className="mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Si el problema persiste, por favor{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contacta con soporte
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
