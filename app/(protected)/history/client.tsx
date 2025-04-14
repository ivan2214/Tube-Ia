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

interface ClientHistoryProps {
  videos?: VideoWithRelations[];
}

export const ClientHistory: React.FC<ClientHistoryProps> = ({ videos }) => {
  const handleClearHistory = async () => {
    try {
      await clearHistory();

      toast.success("Éxito", {
        description: "Historial borrado exitosamente",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Error al borrar el historial",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Historial"
        description="Tus videos analizados previamente"
        action={
          <Button
            variant="outline"
            onClick={handleClearHistory}
            disabled={videos?.length === 0}
          >
            Borrar Historial
          </Button>
        }
      />

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos?.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-lg">
                  {entry.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={`https://img.youtube.com/vi/${entry.id}/mqdefault.jpg`}
                    alt={entry.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-gray-500 text-sm">
                  hace {formatDistanceToNow(new Date(entry.createdAt))}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/video/${entry.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver video
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};
