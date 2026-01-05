import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TradeMind - Trading Discipline & Performance Tracker",
    template: "%s | TradeMind",
  },
  description:
    "Maintain trading discipline, track trades, monitor risk, and analyze performance with TradeMind - built for Indian stock & options traders.",
  keywords: [
    "trading journal",
    "trade tracker",
    "Indian stock market",
    "NSE",
    "BSE",
    "options trading",
    "trading discipline",
    "risk management",
  ],
  authors: [{ name: "TradeMind" }],
  creator: "TradeMind",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
