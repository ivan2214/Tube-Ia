import { redirect } from "next/navigation";
import type React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { getCurrentUser } from "@/entities/user/hooks/current-user";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/?auth=signin");
  }

  if (currentUser.roleUser !== "ADMIN") {
    redirect("/?error=forbidden");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-3xl">Panel de Administración</h1>

      <Tabs defaultValue="users" className="mb-8">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="users" asChild>
            <Link href="/admin/users">Usuarios</Link>
          </TabsTrigger>
          <TabsTrigger value="videos" asChild>
            <Link href="/admin/videos">Videos</Link>
          </TabsTrigger>
          <TabsTrigger value="chats" asChild>
            <Link href="/admin/chats">Chats</Link>
          </TabsTrigger>
          <TabsTrigger value="histories" asChild>
            <Link href="/admin/histories">Historiales</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
