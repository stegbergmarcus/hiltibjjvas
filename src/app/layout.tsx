import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

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

import { getVideosWithAutoSync } from "@/lib/youtube";

// ... (existing imports, but we need to ensure getVideosWithAutoSync is imported)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch videos globally to populate calendar
  let activeDates: string[] = [];
  /*
  try {
    const videos = await getVideosWithAutoSync();
    // Extract unique dates (YYYY-MM-DD)
    const dateSet = new Set(videos
        .filter(v => v.publishedAt)
        .map(v => {
            try {
                return new Date(v.publishedAt).toISOString().split('T')[0];
            } catch (e) {
                return null;
            }
        })
        .filter(Boolean) as string[]
    );
    activeDates = Array.from(dateSet);
  } catch (error) {
    console.error("Failed to fetch videos for calendar:", error);
  }
  */

  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <Suspense fallback={<div className="hidden lg:block w-80 h-screen bg-[#121212] border-r border-white/5" />}>
              <Sidebar activeDates={activeDates} />
            </Suspense>

            <div className="flex-1 flex flex-col min-h-screen w-full">
              {/* Navbar */}
              <Navbar />

              {/* Main Content */}
              <div className="flex-1 w-full max-w-[1920px] mx-auto">
                {children}
              </div>

              {/* Mobile Bottom Nav */}
              <div className="lg:hidden">
                <BottomNav />
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
