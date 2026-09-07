import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormWartaAccessible } from "@/components/warta/FormWartaAccessible";

export const metadata: Metadata = {
  title: "Tulis & Terbitkan Warta Paguyuban — Admin KKS",
  description: "Formulir penerbitan warta dan agenda paguyuban yang mudah, jelas, dan ramah pengurus.",
};

export default function NewWartaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-28">
      {/* Header Navigasi & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-200">
        <Link
          href="/warta"
          className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 font-semibold text-sm transition border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          <span>Kembali ke Daftar Warta</span>
        </Link>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-start sm:self-auto">
          Formulir Pengurus Warta
        </span>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Formulir Terbit Kabar & Kegiatan Warga
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          Silakan ikuti 2 langkah mudah di bawah ini. Cukup pilih jenis kabar, lalu lengkapi kolom yang muncul.
        </p>
      </div>

      {/* Komponen Form Ramah Lansia / Accessible */}
      <FormWartaAccessible />
    </div>
  );
}
