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
  title: "Administrar Chats | YouTube AI Analyzer",
  description: "Panel de administración para gestionar chats de la plataforma.",
};

// Simulación de datos de chats

export default async function AdminChatsPage() {
  const chats = await db.chat.findMany({
    include: {
      video: {
        include: {
          history: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Gestión de Chats</h2>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input placeholder="Buscar por título de video o usuario" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Todos
              </Button>
              <Button variant="outline" size="sm">
                Recientes
              </Button>
              <Button variant="outline" size="sm">
                Más activos
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
                <TableHead>Video</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Mensajes</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Último mensaje</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{chat.video?.title}</span>
                      <span className="text-muted-foreground text-xs">
                        ID: {chat.videoId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{chat.video?.history.user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {chat.messages?.toLocaleString().length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver chat completo</DropdownMenuItem>
                        <DropdownMenuItem>
                          Ver video relacionado
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Exportar conversación
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar chat
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
          Mostrando 5 de 38 chats
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
