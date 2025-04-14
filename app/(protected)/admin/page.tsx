import { redirect } from "next/navigation";

import { db } from "@/db";
import { UserTable } from "@/entities/admin/components/user-table";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import Container from "@/shared/components/container";

export default async function AdminPage() {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/?auth=signin");
  }

  if (currentUser.roleUser !== "ADMIN") {
    redirect("/?error=forbidden");
  }

  // Fetch users for the admin panel
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container>
      <h1 className="mb-6 font-bold text-3xl">Panel de Administración</h1>
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administrar cuentas y permisos de usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={users} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Productos</CardTitle>
              <CardDescription>
                Administrar productos e inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Aquí va el contenido de gestión de productos</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Administrador</CardTitle>
              <CardDescription>Configurar ajustes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Aquí va el contenido de configuración</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
