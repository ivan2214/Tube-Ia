"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

import { AuthButtons } from "@/entities/auth/components/auth-buttons";

import type { NavItem } from "../types/nav";
import type { User } from "@/prisma/generated";

interface MobileMenuProps {
  navItems: NavItem[];
  currentUser: User | null;
}

export const MobileMenu = ({ navItems, currentUser }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[400px]">
        <nav className="mt-15 flex flex-col gap-4">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <Collapsible
                  key={`nav-item-children-${item.href}`}
                  className="w-full"
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-left font-medium text-lg hover:bg-muted">
                    {item.name}
                    <ChevronRight className="h-5 w-5 transition-transform duration-200 [&[data-state=open]>svg]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4">
                    <div className="flex flex-col space-y-2 py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href as string}
                          className="rounded-md px-4 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-emerald-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                href={item.href as string}
                key={item.href}
                className="rounded-md px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted hover:text-emerald-600"
              >
                {item.name}
              </Link>
            );
          })}
          <div className="mt-4 px-4">
            <AuthButtons navItems={navItems} currentUser={currentUser} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
