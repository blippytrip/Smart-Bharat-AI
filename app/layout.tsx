import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Smart Bharat AI — AI-Powered Civic Action Agent",
  description:
    "Smart Bharat AI transforms citizen problems into actionable government workflows. Get document checklists, report civic issues, find schemes, and more.",
  keywords: "government services, civic AI, India, passport, driving license, schemes, complaint",
  openGraph: {
    title: "Smart Bharat AI",
    description: "AI-Powered Civic Action Agent for Indian Citizens",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-nearblack bg-offwhite`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-200 bg-navy-950 py-12 text-center text-sm text-gray-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <p className="font-medium text-white">
              🇮🇳 Smart Bharat AI &mdash; Built for Indian Citizens &middot;{" "}
              <span className="text-saffron">Powered by Gemini AI</span>
            </p>
            <p className="mt-2 text-xs text-gray-500 max-w-md">
              This is a demonstration platform. Always verify information from official government sources. Designed with premium civic engineering.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
