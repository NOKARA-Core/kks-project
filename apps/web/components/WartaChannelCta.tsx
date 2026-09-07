"use client";

import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface WartaChannelCtaProps {
  className?: string;
  variant?: "full" | "compact";
}

export function WartaChannelCta({
  className = "",
  variant = "full",
}: WartaChannelCtaProps) {
  const channelUrl =
    process.env.NEXT_PUBLIC_WA_CHANNEL_URL ||
    "https://whatsapp.com/channel/0029VbDSxiID38CTGypJBm3p";

  if (variant === "compact") {
    return (
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 transition-all text-xs font-semibold shadow-2xs ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Saluran WA KKS Mimika</span>
        <ArrowRight className="w-3 h-3 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${className}`}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MessageCircle className="w-3.5 h-3.5" />
            Saluran WhatsApp Resmi
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Privasi Terlindungi
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Ikuti Saluran Warta KKS Mimika
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Dapatkan pemberitahuan lelayu dan kabar paguyuban langsung di WhatsApp
          secara anonim & aman (nomor telepon Anda tidak terlihat oleh sesama
          pengikut saluran).
        </p>
      </div>

      <div className="w-full md:w-auto flex-shrink-0">
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-95 group"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Gabung Saluran Warta KKS</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
