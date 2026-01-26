import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hilti BJJ Library",
  description: "Video library for Hilti BJJ training sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <Suspense fallback={<div className="hidden lg:block w-80 h-screen bg-[#121212] border-r border-white/5" />}>
            <Sidebar />
          </Suspense>

          <div className="flex-1 flex flex-col min-h-screen w-full">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <Navbar />
            </div>

            {/* Main Content */}
            {children}

            {/* Mobile Bottom Nav */}
            <div className="lg:hidden">
              <BottomNav />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
