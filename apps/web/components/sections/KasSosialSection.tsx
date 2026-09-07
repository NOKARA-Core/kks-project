import Link from "next/link";
import {
  HeartHandshake,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatRupiah, formatWhatsAppUrl } from "@/lib/utils";

interface KasSosialSectionProps {
  totalSaldo: number;
  totalSantunanKeluar: number;
  jumlahPenerimaSantunan: number;
}

export function KasSosialSection({
  totalSaldo,
  totalSantunanKeluar,
  jumlahPenerimaSantunan,
}: KasSosialSectionProps) {
  const konfirmasiWaUrl = formatWhatsAppUrl(
    siteConfig.hotlineWa,
    `Halo Bendahara KKS Mimika, saya ingin konfirmasi penyaluran iuran/donasi kas sosial paguyuban melalui rekening ${siteConfig.bank.name}.`
  );

  return (
    <section className="py-14 sm:py-20 bg-canvas-soft border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Card Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                <span>Salipuri Temmadinging &bull; Kas Siaga Duka</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Transparansi Kas Sosial & Santunan Warga
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Setiap rupiah iuran sukarela warga tercatat terbuka untuk santunan duka cita, pendampingan keluarga musibah, dan operasional layanan kemanusiaan di Timika.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/sosial"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs"
              >
                <span>Lihat Laporan Buku Kas Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-canvas-soft border border-slate-200/70 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Saldo Kas Siaga Saat Ini
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatRupiah(totalSaldo)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Dana siaga darurat paguyuban
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-soft border border-slate-200/70 space-y-1">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Santunan Telah Disalurkan
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 tracking-tight">
                {formatRupiah(totalSantunanKeluar)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Penyaluran duka lelayu warga
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-soft border border-slate-200/70 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Penerima Manfaat Santunan
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {jumlahPenerimaSantunan} Kasus Duka
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Keluarga warga rantau terayomi
              </p>
            </div>
          </div>

          {/* Rekening Resmi & CTA Iuran */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-2xs">
                <CreditCard className="w-5 h-5 text-gold" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Rekening Resmi Kas Sosial KKS:
                </span>
                <div className="font-mono text-lg sm:text-xl font-extrabold text-slate-900 tracking-wide">
                  {siteConfig.bank.accountNo}{" "}
                  <span className="text-xs font-sans font-bold text-slate-500">
                    ({siteConfig.bank.name})
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Atas Nama: <strong className="text-slate-800">{siteConfig.bank.accountHolder}</strong>
                </p>
              </div>
            </div>

            <a
              href={konfirmasiWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs w-full md:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi Bukti Transfer via WA</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
