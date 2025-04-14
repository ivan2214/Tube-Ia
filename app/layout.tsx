import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/entities/auth/providers/auth-provider";
import Navbar from "@/shared/components/navbar";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ClientProvider } from "@/shared/providers/client-provider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Video Timeline Generator",
  description: "Generate a timeline of topics discussed in YouTube videos",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <AuthProvider>
              <ClientProvider>
                <main className="@container flex min-h-screen flex-col">
                  <Navbar />
                  <section className="flex-1">{children}</section>
                  <Toaster />
                </main>
              </ClientProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
