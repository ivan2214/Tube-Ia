import { db } from "@/db";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import Container from "@/shared/components/container";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/?auth=signin");
  }

  // Fetch user data with additional information
  const user = await db.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      roleUser: true,
      createdAt: true,
    },
  });

  return (
    <Container>
      <h1 className="mb-6 font-bold text-3xl">Panel de Control</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>¡Bienvenido, {user?.name || "Usuario"}!</CardTitle>
            <CardDescription>
              Has iniciado sesión con {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Esta es una ruta protegida que requiere autenticación.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/profile">Ver Perfil</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/purchases">Ver Compras</Link>
              </Button>
              {user?.roleUser === "ADMIN" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">Panel de Administrador</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
            <CardDescription>
              Gestiona los detalles de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Actualiza tu información de perfil y preferencias.
            </p>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/profile">Editar Perfil</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad</CardTitle>
            <CardDescription>Tu actividad reciente</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Último inicio de sesión</span>
                <span className="text-muted-foreground">Hoy, 10:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Cuenta creada</span>
                <span className="text-muted-foreground">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
