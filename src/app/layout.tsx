import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "../styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlentejanoWeightMission",
  description: "Your personal weight loss journey companion",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#00628d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
