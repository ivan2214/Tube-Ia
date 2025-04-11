import type React from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/entities/user/hooks/current-user";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/?auth=signin");
  }

  return <>{children}</>;
}
