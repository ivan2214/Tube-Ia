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
import { Badge } from "@/shared/components/ui/badge";
import { db } from "@/db";
import { Filter, MoreHorizontal } from "lucide-react";

export const metadata = {
  title: "Administrar Historiales | YouTube AI Analyzer",
  description:
    "Panel de administración para gestionar historiales de usuarios en la plataforma.",
};

// Simulación de datos de historiales

export default async function AdminHistoriesPage() {
  const histories = await db.history.findMany({
    include: {
      user: true,
      _count: {
        select: {
          videos: true,
        },
      },
    },
  });
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Gestión de Historiales</h2>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input placeholder="Buscar por nombre de usuario" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Todos
              </Button>
              <Button variant="outline" size="sm">
                Activos
              </Button>
              <Button variant="outline" size="sm">
                Inactivos
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
                <TableHead>Usuario</TableHead>
                <TableHead>Videos analizados</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {histories.map((history) => (
                <TableRow key={history.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{history.user.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ID: {history.userId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{history._count.videos}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(history.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(history.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Ver historial completo
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Ver perfil de usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem>Exportar historial</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar historial
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
          Mostrando 5 de 25 historiales
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
