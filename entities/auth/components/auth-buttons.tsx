"use client";

import type React from "react";

import { LogOut, UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuth } from "@/entities/auth/hooks/use-auth";

import type { User } from "@/prisma/generated";
import type { NavItem } from "@/shared/types/nav";

interface AuthButtonsProps {
  currentUser: User | null;
  navItems: NavItem[];
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({
  currentUser,
  navItems,
}) => {
  const { setLoginModalOpen, setRegisterModalOpen } = useAuth();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Build navigation items based on user role

  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 font-medium text-sm">
            {currentUser?.name || currentUser?.email}
          </div>
          <DropdownMenuSeparator />

          {navItems.map((item, index) => {
            // For items with children, use DropdownMenuSub
            if (item.children && item.children.length > 0) {
              return (
                <DropdownMenuSub key={`nav-item-${item.name}`}>
                  <DropdownMenuSubTrigger>
                    <span>{item.name}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        asChild
                        key={`child-${index}-${child.name}`}
                      >
                        <Link href={child.href || "#"}>{child.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              );
            }

            // For regular items
            return (
              <DropdownMenuItem asChild key={`nav-item-${item.name}`}>
                <Link href={item.href || "#"}>{item.name}</Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-2 md:flex-row md:gap-2">
      <Button variant="outline" onClick={() => setLoginModalOpen(true)}>
        Sign In
      </Button>
      <Button onClick={() => setRegisterModalOpen(true)}>Register</Button>
    </div>
  );
};
