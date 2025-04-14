import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: [
    // Match all protected routes
    "/dashboard/:path*",
    "/profile/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/purchases/:path*",
    // Add any other protected routes here
  ],
};
