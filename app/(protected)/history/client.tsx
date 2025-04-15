"use client";

import Link from "next/link";

import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatDistanceToNow } from "@/shared/utils/date-utils";
import type { VideoWithRelations } from "@/entities/video/actions/video-db";
import { clearHistory } from "@/entities/history/actions/history-action";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useState } from "react";
import { Loader } from "lucide-react";
import { extractVideoId } from "@/shared/utils/youtube-utils";

interface ClientHistoryProps {
  videos?: VideoWithRelations[];
}

export const ClientHistory: React.FC<ClientHistoryProps> = ({ videos }) => {
  const [isLoading, setIsloading] = useState(false);
  const handleClearHistory = async () => {
    try {
      setIsloading(true);
      await clearHistory();

      toast.success("Éxito", {
        description: "Historial borrado exitosamente",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Error al borrar el historial",
      });
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Historial"
        description="Tus videos analizados previamente"
        action={
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="w-full">
                Borrar historial
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará tu historial
                  tus videosy tus chatss sobre el video
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearHistory}
                  disabled={videos?.length === 0}
                >
                  Borrar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />

      <div className="mt-8">
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos?.map((entry) => {
              const id = extractVideoId(entry.url);
              return (
                <Card key={entry.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg">
                      {entry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                      <img
                        src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                        alt={entry.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-gray-500 text-sm">
                      hace {formatDistanceToNow(new Date(entry.createdAt))}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/video/${id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Ver video
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
