import { redirect } from "next/navigation";

import { db } from "@/db";
import { ProfileForm } from "@/entities/user/components/profile-form";
import { getCurrentUser } from "@/entities/user/hooks/current-user";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Container from "@/shared/components/container";

export default async function ProfilePage() {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/?auth=signin");
  }

  // Fetch user data from database
  const user = await db.user.findUnique({
    where: {
      id: currentUser.id,
    },
  });

  if (!user) {
    redirect("/?auth=signin");
  }

  return (
    <Container>
      <h1 className="mb-6 font-bold text-3xl">Tu Perfil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Perfil</CardTitle>
            <CardDescription>
              Actualiza la información de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Cuenta</CardTitle>
            <CardDescription>
              Tu información y configuración de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium text-muted-foreground text-sm">
                ID de Cuenta
              </div>
              <div className="truncate text-sm">{user.id}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium text-muted-foreground text-sm">
                Correo
              </div>
              <div className="text-sm">{user.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium text-muted-foreground text-sm">
                Rol
              </div>
              <div className="text-sm capitalize">{user.roleUser}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="font-medium text-muted-foreground text-sm">
                Miembro Desde
              </div>
              <div className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Descargar tus Datos
            </Button>
          </CardFooter>
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
