import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

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
  metadataBase: new URL(siteConfig.appUrl || "http://localhost:3009"),
  title: {
    default: `${siteConfig.shortOrgName} — ${siteConfig.orgName}`,
    template: `%s | ${siteConfig.shortOrgName}`,
  },
  description:
    `Portal resmi warta, silaturahmi, dan pendataan warga paguyuban ${siteConfig.orgName}, Papua Tengah. Menjaga kerukunan dan persaudaraan di tanah rantau.`,
  keywords: [
    "KKS Timika",
    "Kerukunan Keluarga Soppeng",
    "Soppeng Mimika",
    "Paguyuban Soppeng Papua",
    "Warga Rantau Soppeng",
    "Yassisoppengi",
    "Timika Papua Tengah",
  ],
  authors: [{ name: siteConfig.orgName }],
  creator: siteConfig.orgName,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-kks.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${siteConfig.shortOrgName} — ${siteConfig.orgName}`,
    description:
      `Portal resmi silaturahmi, warta komunitas, dan pendataan warga perantau Soppeng di Tanah Amungsa/Mimika, Papua Tengah.`,
    url: siteConfig.appUrl,
    siteName: siteConfig.shortOrgName,
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: `Logo Resmi ${siteConfig.orgName}`,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.shortOrgName} — ${siteConfig.orgName}`,
    description:
      `Portal resmi silaturahmi, warta komunitas, dan pendataan warga perantau Soppeng di Kabupaten Mimika, Papua Tengah.`,
    images: ["/icon-512x512.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-canvas text-slate-900 antialiased`}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
