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

export const metadata: Metadata = {
  title: "Admin KKS Mimika — Manajemen Paguyuban Keluarga Soppeng",
  description:
    "Dashboard Manajemen Resmi Pengurus Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika, Papua Tengah.",
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
