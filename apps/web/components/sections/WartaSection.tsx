"use client";

import Link from "next/link";
import {
  HeartHandshake,
  Calendar,
  Sparkles,
  MessageCircle,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";


interface WartaSectionProps {
  className?: string;
}

export function WartaSection({ className = "" }: WartaSectionProps) {
  return (
    <section className={`py-14 sm:py-18 bg-white border-b border-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Kabar Paguyuban Terkini
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Warta & Agenda Warga di Rantau
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              Kanal informasi resmi seputar kabar suka dan duka sesama warga
              perantau Soppeng di Kabupaten Mimika.
            </p>
          </div>

          <Link
            href="/warta"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-gold hover:text-gold-dark group shrink-0"
          >
            <span>Buka Semua Warta</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Featured Lelayu Card & Agenda Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Lelayu Card (High Priority Alert, Siri' red border) - 7 cols */}
          <article className="lg:col-span-7 p-6 sm:p-7 bg-white rounded-2xl border-l-4 border-l-siri border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-siri/10 text-siri">
                  <span className="w-1.5 h-1.5 rounded-full bg-siri animate-ping" />
                  KABAR DUKA CITA (LELAYU)
                </span>
                <span className="text-xs text-slate-400 font-medium">Timika</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                Berpulang ke Rahmatullah: Bapak H. Andi Mappanyukki (68 Tahun)
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Telah berpulang salah seorang tokoh sesepuh perantau Soppeng di Distrik Mimika Baru. Jenazah disemayamkan di rumah duka Jl. Budi Utomo, Timika sebelum dihantarkan ke peristirahatan terakhir.
              </p>

              <div className="p-3.5 bg-canvas-soft rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div>
                  <strong>Rumah Duka:</strong> Jl. Budi Utomo Ujung, Kel. Inauga, Timika
                </div>
                <div>
                  <strong>Pemakaman:</strong> TPU KM 11 Timika, Ba&rsquo;da Ashar
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Salipuri Temmadinging • Kas Siaga
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href="/warta#duka"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 transition"
                >
                  Detail Info
                </Link>
                <a
                  href="https://wa.me/?text=Innalillahi%20wa%20inna%20ilaihi%20rajiun.%20Turut%20berduka%20cita%20mendalam%20atas%20berpulangnya%20Almarhum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-siri hover:bg-siri/90 text-white font-semibold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Kirim Takziah
                </a>
              </div>
            </div>
          </article>

          {/* Agenda & Sukacita Cards - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Sukacita Card */}
            <div className="p-5 bg-canvas-soft rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kabar Suka Cita & Syukuran</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                Akad & Resepsi Pernikahan Ananda Andi Fadil & Nurul Hasanah
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                Mengundang keluarga besar perantau KKS di Gedung Tongkonan Timika.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Minggu, 20 September 2026</span>
                <Link href="/warta#sukacita" className="text-gold font-semibold hover:underline">
                  Lihat Undangan &rarr;
                </Link>
              </div>
            </div>

            {/* Agenda Silaturahmi Card */}
            <div className="p-5 bg-canvas-soft rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-dark uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Agenda Silaturahmi Rutin</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                Arisan & Pengajian Rutin Warga KKS Sektor Mimika Baru
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                Wadah temu kangen dan pengumpulan iuran kas sosial sukarela di kediaman H. Usman.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>13 September 2026 • 15:30 WIT</span>
                <Link href="/warta#agenda" className="text-sky-dark font-semibold hover:underline">
                  Rute Lokasi &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

