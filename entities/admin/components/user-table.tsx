"use client";

import { updateUserRole } from "@/entities/admin/actions/admin";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { RoleUser, User } from "@/prisma/generated";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: RoleUser) => {
    setIsLoading(userId);

    try {
      const result = await updateUserRole(userId, newRole);

      if (result.error) {
        toast.error("Error", {
          description: result.error,
        });
        return;
      }

      toast.success("Éxito", {
        description: "Rol de usuario actualizado exitosamente",
      });

      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Error al actualizar el rol del usuario",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Correo</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-left">Creado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name || "N/A"}</td>
              <td className="p-2">{user.email || "N/A"}</td>
              <td className="p-2">
                <Badge
                  variant={user.roleUser === "ADMIN" ? "default" : "outline"}
                >
                  {user.roleUser}
                </Badge>
              </td>
              <td className="p-2">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.roleUser === "ADMIN" ? "USER" : "ADMIN"
                        )
                      }
                      disabled={isLoading === user.id}
                    >
                      {user.roleUser === "ADMIN"
                        ? "Quitar Admin"
                        : "Hacer Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
