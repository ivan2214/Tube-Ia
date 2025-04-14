"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { extractVideoId } from "@/shared/utils/youtube-utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";

interface VideoSearchProps {
  hasApiKey: boolean;
}

export function VideoSearch({ hasApiKey }: VideoSearchProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasApiKey) {
      setError("Por favor, agrega tu clave API de Google para continuar");
      return;
    }

    setError("");

    const videoId = extractVideoId(input);
    if (!videoId) {
      setError("Por favor, ingresa una URL o ID válido de YouTube");
      return;
    }

    onSubmit(videoId);
  };
  const router = useRouter();

  const onSubmit = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analizar un Video de YouTube</CardTitle>
        <CardDescription>
          Ingresa una URL o ID de YouTube para generar una línea de tiempo y
          chatear sobre su contenido.
          <Badge
            variant={hasApiKey ? "default" : "destructive"}
            className="mt-2"
          >
            Necesitas una clave API de Google para usar esta funcionalidad.
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={error ? "border-red-500" : ""}
              disabled={!hasApiKey}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button disabled={!hasApiKey} type="submit" className="w-full">
            Generar Línea de Tiempo y chatear
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
