import type { User } from "@/prisma/generated";
import type { NavItem } from "@/shared/types/nav";

const adminNavItems: NavItem[] = [
  {
    name: "Admin",
    href: "/admin",
    children: [
      { name: "Users", href: "/admin/users" },
      { name: "Videos", href: "/admin/videos" },
      { name: "Chat", href: "/admin/chats" },
    ],
  },
];

const userNavItems: NavItem[] = [
  { name: "Profile", href: "/profile" },
  { name: "Historial", href: "/history" },
];

const guestNavItems: NavItem[] = [
  // para los usuarios no autenticados
  {
    name: "Inicio",
    href: "/",
  },
  {
    name: "Como obtener mi api key?",
    href: "/how-to-get-api-key",
  },
  {
    name: "Sobre Nosotros",
    href: "/about",
  },
  {
    name: "Contacto",
    href: "/contact",
  },
];

export async function getNavItems(currentUser: User | null) {
  let navItems: NavItem[] = [];

  if (currentUser) {
    if (currentUser.roleUser === "ADMIN") {
      // Admin users see all navigation items
      navItems = [...guestNavItems, ...userNavItems, ...adminNavItems];
    } else {
      // Logged in non-admin users see user and guest navigation items
      navItems = [...userNavItems, ...guestNavItems];
    }
  } else {
    // Non-logged in users only see guest navigation items
    navItems = guestNavItems;
  }

  return navItems;
}
