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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-white/10 bg-navy-950 py-8 text-center text-sm text-gray-500">
          <p>
            🇮🇳 Smart Bharat AI &mdash; Built for Indian Citizens &middot;{" "}
            <span className="text-saffron">Powered by Gemini AI</span>
          </p>
          <p className="mt-1 text-xs text-gray-600">
            This is a demonstration platform. Always verify information from official government sources.
          </p>
        </footer>
      </body>
    </html>
  );
}
