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
  openGraph: {
    title: `${siteConfig.shortOrgName} — ${siteConfig.orgName}`,
    description:
      `Portal resmi silaturahmi, warta komunitas, dan pendataan warga perantau Soppeng di Tanah Amungsa/Mimika, Papua Tengah.`,
    url: siteConfig.appUrl,
    siteName: siteConfig.shortOrgName,
    locale: "id_ID",
    type: "website",
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
