import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import React from "react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const satoshiFont = localFont({
  variable: "--satoshi-font",
  display: "swap",
  src: [
    {
      path: "../fonts/Satoshi-Variable.ttf",
      weight: "variable",
    },
  ],
});

export const metadata: Metadata = {
  title: "itumo",
  description:
    "itumo subtitles videos in Yoruba, enhancing cultural accessibility and representation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          satoshiFont.className,
          "flex flex-col h-screen bg-background",
        )}
      >
        <Header />
        <main>{children}</main>
        <Toaster duration={3000} />
      </body>
    </html>
  );
}
