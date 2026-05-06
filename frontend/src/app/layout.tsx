"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLanding = pathname === "/" || pathname === "/landing";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-landing={isLanding ? "true" : undefined}>
      <body
        suppressHydrationWarning
        className="theme min-h-screen bg-background text-foreground antialiased"
      >
        {children}
      </body>
    </html>
  );
}
