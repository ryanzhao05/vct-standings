import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VCT Standings",
  description:
    "Interactive VCT standings predictor for Valorant esports. Predict match outcomes and see how your favorite teams can qualify for playoffs.",
  keywords:
    "VCT, Valorant, esports, standings, predictions, Valorant Champions Tour",
  icons: {
    icon: "/vct_logo.png",
    shortcut: "/vct_logo.png",
    apple: "/vct_logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
