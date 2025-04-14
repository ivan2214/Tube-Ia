import { redirect } from "next/navigation";
import type React from "react";

import { getCurrentUser } from "@/entities/user/hooks/current-user";

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

  return <>{children}</>;
}
