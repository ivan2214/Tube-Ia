import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Filter, MoreHorizontal } from "lucide-react";
import { db } from "@/db";

export const metadata = {
  title: "Administrar Videos | YouTube AI Analyzer",
  description:
    "Panel de administración para gestionar videos analizados en la plataforma.",
};

// Simulación de datos de videos

// Función para formatear la duración en formato hh:mm:ss
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
}

export default async function AdminVideosPage() {
  const videos = await db.video.findMany({
    include: {
      history: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          timeline: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Gestión de Videos</h2>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input placeholder="Buscar por título o URL" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Todos
              </Button>
              <Button variant="outline" size="sm">
                Con chat
              </Button>
              <Button variant="outline" size="sm">
                Sin chat
              </Button>
            </div>
            <div className="flex justify-end">
              <Button variant="outline">
                <Filter className="mr-2" />
                Filtros avanzados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha de análisis</TableHead>
                <TableHead>Puntos de línea de tiempo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{video.title}</span>
                      <span className="max-w-xs truncate text-muted-foreground text-xs">
                        {video.url}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDuration(video.duration)}</TableCell>
                  <TableCell>{video.history.user.name}</TableCell>
                  <TableCell>
                    {new Date(video.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{video._count.timeline}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Ver línea de tiempo</DropdownMenuItem>
                        <DropdownMenuItem>Ver chat</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar video
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Mostrando 5 de 42 videos
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
