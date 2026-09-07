import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Admin ${siteConfig.shortOrgName} — Manajemen ${siteConfig.orgName}`,
  description:
    `Dashboard Manajemen Resmi Pengurus ${siteConfig.orgName}, Papua Tengah.`,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full bg-canvas-soft">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full font-sans text-slate-900 bg-canvas-soft antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
