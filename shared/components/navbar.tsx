import Link from "next/link";

import { ModeToggle } from "@/shared/components/mode-toggle";

import { getCurrentUser } from "@/shared/hooks/current-user";
import { MobileMenu } from "@/shared/components/mobile-menu";
import { AuthButtons } from "@/entities/auth/components/auth-buttons";
import { DesktopMenu } from "@/shared/components/desktop-menu";
import { getApiKey } from "../actions/api-key-actions";
import { ApiKeyButton } from "./api-key-button";
import { getNavItems } from "../constants/navbar";

export default async function Navbar() {
  const { currentUser } = await getCurrentUser();

  const { apiKey } = await getApiKey();
  const hasApiKey = !!apiKey;

  const navItems = await getNavItems(currentUser);

  return (
    <header className="container mx-auto border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-x-2 font-bold text-xl"
          >
            <img
              src="/tube-ia-logo.webp"
              alt="Logo"
              className="h-15 w-15 rounded-full"
            />
            Tube Ia
          </Link>

          {/* Desktop Navigation */}
          <DesktopMenu navItems={navItems} />
        </div>

        <div className="flex items-center gap-0 p-2 md:gap-x-3 md:p-0">
          <ApiKeyButton hasApiKey={hasApiKey} />

          <ModeToggle />

          <div className="hidden md:block">
            <AuthButtons
              navItems={navItems}
              currentUser={currentUser || null}
            />
          </div>

          {/* Mobile Navigation */}
          <MobileMenu navItems={navItems} currentUser={currentUser} />
        </div>
      </div>
    </header>
  );
}
