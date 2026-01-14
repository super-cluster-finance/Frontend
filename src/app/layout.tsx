import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Super Cluster",
  description: "Bridge your PT to supported chains with Super Cluster",
  icons: {
    icon: [
      { url: "/logo-sc.png" },
      { url: "/logo-sc.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-sc.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logo-sc.png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo-sc.png" />
        <link rel="apple-touch-icon" href="/logo-sc.png" />
      </head>
      <body className={`${overpass.variable} bg-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
