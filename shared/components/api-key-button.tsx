"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Key } from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { deleteApiKey } from "../actions/api-key-actions";
import { toast } from "sonner";

interface ApiKeyButtonProps {
  hasApiKey: boolean;
  onApiKeyChange?: () => void;
}

export function ApiKeyButton({ hasApiKey, onApiKeyChange }: ApiKeyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteApiKey = async () => {
    try {
      const result = await deleteApiKey();

      if (result.error) {
        toast.error("Error", {
          description: result.error,
        });
      } else {
        toast.info("API Key eliminada", {
          description: "Tu API key ha sido eliminada correctamente",
        });

        if (onApiKeyChange) {
          onApiKeyChange();
        }
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al eliminar la API key",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Key className="h-5 w-5" />
            {hasApiKey && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {hasApiKey ? (
            <>
              <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                Cambiar API Key
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteApiKey}>
                Eliminar API Key
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              Configurar API Key
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ApiKeyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={onApiKeyChange}
      />
    </>
  );
}
