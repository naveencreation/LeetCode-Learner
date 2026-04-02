import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeArena",
  description: "CodeArena - interactive tree traversal learning app",
  icons: {
    icon: "/codearena-mark.svg",
    shortcut: "/codearena-mark.svg",
    apple: "/codearena-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="theme min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
