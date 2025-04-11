"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { LoginModal } from "@/entities/auth/components/login-modal";
import { RegisterModal } from "@/entities/auth/components/register-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { User, LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
// Añadir el import para el ErrorModal
import { ErrorModal } from "@/entities/auth/components/error-modal";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  // Dentro del componente Navbar, añadir estos estados para el modal de error
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  // Check if auth param is present to show the appropriate modal
  // Actualizar el useEffect para manejar los errores de autenticación
  useEffect(() => {
    const authParam = searchParams.get("auth");
    const errorParam = searchParams.get("error");

    if (authParam === "signin") {
      setLoginModalOpen(true);
    } else if (authParam === "signup") {
      setRegisterModalOpen(true);
    } else if (errorParam) {
      setErrorTitle("Error de autenticación");

      // Manejar diferentes tipos de errores
      switch (errorParam) {
        case "CredentialsSignin":
          setErrorDescription(
            "Las credenciales proporcionadas son incorrectas."
          );
          break;
        case "OAuthAccountNotLinked":
          setErrorDescription("Esta cuenta ya está vinculada a otro usuario.");
          break;
        case "EmailSignin":
          setErrorDescription(
            "Error al enviar el correo electrónico de inicio de sesión."
          );
          break;
        case "SessionRequired":
          setErrorDescription(
            "Debes iniciar sesión para acceder a esta página."
          );
          break;
        default:
          setErrorDescription("Se produjo un error durante la autenticación.");
      }

      setErrorModalOpen(true);
    }
  }, [searchParams]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    ...(session
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Profile", href: "/profile" },

          ...(session.user?.roleUser === "ADMIN"
            ? [{ name: "Admin", href: "/admin" }]
            : []),
        ]
      : []),
  ];

  return (
    <>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">
              Next Auth
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium text-sm transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 font-medium text-sm">
                    {session.user?.name || session.user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/purchases">Purchases</Link>
                  </DropdownMenuItem>
                  {session.user?.roleUser === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden gap-2 md:flex">
                <Button variant="ghost" onClick={() => setLoginModalOpen(true)}>
                  Sign In
                </Button>
                <Button onClick={() => setRegisterModalOpen(true)}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-8 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`font-medium text-sm transition-colors hover:text-primary ${
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {!session && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => setLoginModalOpen(true)}
                      >
                        Sign In
                      </Button>
                      <Button onClick={() => setRegisterModalOpen(true)}>
                        Sign Up
                      </Button>
                    </>
                  )}
                  {session && (
                    <Button variant="destructive" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <RegisterModal
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
      />
      {/* Al final del componente, justo antes del cierre del fragmento (antes de </>), añadir: */}
      <ErrorModal
        open={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        title={errorTitle}
        description={errorDescription}
      />
    </>
  );
}
