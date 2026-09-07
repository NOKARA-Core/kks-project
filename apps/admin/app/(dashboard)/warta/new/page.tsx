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
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header Navigasi */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link
          href="/warta"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-sm transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Daftar Warta</span>
        </Link>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Langkah Pembuatan Kabar
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formulir Terbit Kabar & Kegiatan Warga
        </h1>
        <p className="text-base text-slate-600">
          Silakan ikuti 2 langkah mudah di bawah ini. Cukup pilih jenis kabar, lalu isi kolom yang muncul.
        </p>
      </div>

      {/* Komponen Form Ramah Lansia / Accessible */}
      <FormWartaAccessible />
    </div>
  );
}
