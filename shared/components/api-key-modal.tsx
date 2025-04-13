"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { toast } from "sonner";
import { storeApiKey } from "@/shared/actions/api-key-actions";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ApiKeyModal({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      toast.error("Error", {
        description: "Por favor ingresa una API key válida",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await storeApiKey(apiKey);

      if (result.error) {
        toast.error("Error", {
          description: result.error,
        });
      } else {
        toast.success("¡Éxito!", {
          description: "Tu API key ha sido guardada correctamente",
        });

        if (onSuccess) {
          onSuccess();
        }

        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al guardar la API key",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar API Key de Google AI</DialogTitle>
          <DialogDescription>
            Para utilizar la generación de líneas de tiempo, necesitas
            proporcionar tu propia API key de Google AI.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key de Google AI</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa tu API key de Google AI"
                autoComplete="off"
              />
              <p className="text-muted-foreground text-xs">
                Tu API key se almacenará de forma segura y solo será utilizada
                para generar líneas de tiempo.
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                <a
                  href="https://ai.google.dev/tutorials/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ¿Cómo obtener una API key de Google AI?
                </a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar API Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
