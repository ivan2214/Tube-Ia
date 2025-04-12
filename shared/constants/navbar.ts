import type { NavItem } from "@/shared/types/nav";

export const adminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "analiticas",
    href: "/admin/analytics",
  },
  {
    name: "categorias",
    href: "/admin/categories",
  },
  {
    name: "productos",
    href: "/admin/products",
  },
  {
    name: "reportes",
    href: "/admin/reports",
  },
  {
    name: "vendedores",
    href: "/admin/sellers",
  },
  {
    name: "ajustes",
    href: "/admin/settings",
  },
  {
    name: "usuarios",
    href: "/admin/users",
  },
];

export const navItems: NavItem[] = [
  {
    name: "Videos anteriores",
    href: "/videos",
  },
  {
    name: "Planes",
    href: "/subscription-plans",
  },
];
