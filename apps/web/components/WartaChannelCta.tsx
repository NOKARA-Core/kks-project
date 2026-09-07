import Link from "next/link";
import { MessageCircle, ShieldCheck, Lock, UserCheck } from "lucide-react";

interface WartaChannelCtaProps {
  className?: string;
  variant?: "full" | "compact";
}

export function WartaChannelCta({
  className = "",
  variant = "full",
}: WartaChannelCtaProps) {
  if (variant === "compact") {
    return (
      <Link
        href="/pendataan#cek-status"
        className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all text-xs font-semibold shadow-2xs ${className}`}
        title="Akses saluran khusus warga terdaftar & terverifikasi"
      >
        <Lock className="w-3.5 h-3.5 text-slate-500" />
        <span>Saluran Khusus Warga Terverifikasi</span>
      </Link>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${className}`}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-gold to-amber-600" />

      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Saluran Komunitas Tertutup
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Khusus Warga Terverifikasi
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Saluran WhatsApp Resmi Warga KKS Mimika
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Demi keamanan, ketertiban, dan privasi warga paguyuban, akses ke Saluran WhatsApp hanya diberikan kepada perantau yang telah terdaftar dan terverifikasi di Buku Warga KKS Mimika.
        </p>
      </div>

      <div className="w-full md:w-auto flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
        <Link
          href="/pendataan#cek-status"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm"
        >
          <UserCheck className="w-4 h-4" />
          <span>Cek Status Verifikasi Warga</span>
        </Link>
        <Link
          href="/pendataan"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm"
        >
          <span>Daftar Warga Baru</span>
        </Link>
      </div>
    </div>
  );
}
