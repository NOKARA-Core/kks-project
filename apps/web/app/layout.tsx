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

export const metadata: Metadata = {
  title: {
    default: "KKS Timika — Kerukunan Keluarga Soppeng Kabupaten Mimika",
    template: "%s | KKS Timika",
  },
  description:
    "Portal resmi warta, silaturahmi, dan pendataan warga paguyuban Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika, Papua Tengah. Menjaga kerukunan dan persaudaraan di tanah rantau.",
  keywords: [
    "KKS Timika",
    "Kerukunan Keluarga Soppeng",
    "Soppeng Mimika",
    "Paguyuban Soppeng Papua",
    "Warga Rantau Soppeng",
    "Yassisoppengi",
    "Timika Papua Tengah",
  ],
  authors: [{ name: "Kerukunan Keluarga Soppeng Kab. Mimika" }],
  creator: "KKS Kabupaten Mimika",
  openGraph: {
    title: "KKS Timika — Kerukunan Keluarga Soppeng Kabupaten Mimika",
    description:
      "Portal resmi silaturahmi, warta komunitas, dan pendataan warga perantau Soppeng di Tanah Amungsa/Mimika, Papua Tengah.",
    url: "https://kks-mimika.org",
    siteName: "KKS Timika",
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
