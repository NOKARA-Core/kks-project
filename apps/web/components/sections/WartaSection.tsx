import Link from "next/link";
import {
  HeartHandshake,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import type { WartaPaguyuban } from "@repo/database/schema";
import { formatTanggal } from "@/lib/utils";
import { formatImageUrl } from "@/lib/formatImageUrl";

interface WartaSectionProps {
  wartaList: WartaPaguyuban[];
  className?: string;
}

export function WartaSection({ wartaList, className = "" }: WartaSectionProps) {
  return (
    <section className={`py-16 sm:py-24 bg-white border-b border-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Header - Law of Proximity (space-y-2 antar teks header) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Kabar Paguyuban Terkini
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Warta, Lelayu & Agenda Kegiatan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Pemberitahuan resmi kabar suka dan duka serta agenda kebersamaan sesama warga perantau Soppeng di Kabupaten Mimika.
            </p>
          </div>

          <Link
            href="/warta"
            className="inline-flex items-center gap-1.5 h-11 px-4 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover group shrink-0"
          >
            <span>Buka Seluruh Warta</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid Kartu Warta Dinamis (8-point Grid: gap-3 di mobile, gap-6 di desktop) */}
        {wartaList.length === 0 ? (
          <div className="p-12 text-center bg-canvas-soft rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">
              Belum ada warta terbaru yang diterbitkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {wartaList.map((item) => {
              const isDuka = item.kategori === "duka_cita";
              const isAgenda = item.kategori === "agenda_kegiatan";
              const isSuka = item.kategori === "suka_cita";

              const badgeClass = isDuka
                ? "bg-rose-50 text-rose-700 border-rose-200/80"
                : isAgenda
                ? "bg-sky-50 text-sky-700 border-sky-200/80"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/80";

              const badgeLabel = isDuka
                ? "Lelayu"
                : isAgenda
                ? "Agenda"
                : "Suka Cita";

              const fullBadgeLabel = isDuka
                ? "Kabar Duka (Lelayu)"
                : isAgenda
                ? "Agenda & Turnamen"
                : "Kabar Suka Cita";

              const detailUrl = `/warta/${item.slug || item.id}`;
              const imageSrc = formatImageUrl(item.fotoUtamaUrl, "/placeholder-kks.webp");

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Cover (aspect-video sm:aspect-16/9) */}
                    <div className="relative w-full aspect-video sm:aspect-16/9 overflow-hidden bg-slate-100 rounded-t-xl sm:rounded-t-2xl">
                      <img
                        src={imageSrc}
                        alt={item.judul}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Top Overlay Badge */}
                      <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold border backdrop-blur-xs shadow-2xs ${badgeClass}`}
                        >
                          {isDuka && <HeartHandshake className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                          {isAgenda && <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                          {isSuka && <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                          <span className="sm:hidden">{badgeLabel}</span>
                          <span className="hidden sm:inline">{fullBadgeLabel}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Body (Padding 8-point: p-3 di mobile, p-5 di desktop) */}
                    <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                      {/* Meta Waktu & Lokasi */}
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                          <time dateTime={item.createdAt.toISOString()}>
                            {formatTanggal(item.createdAt)}
                          </time>
                        </span>
                        <span className="hidden sm:inline">&bull;</span>
                        <span className="hidden sm:flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {item.lokasiNamaTempat || item.alamatDukaTimika || "Timika"}
                          </span>
                        </span>
                      </div>

                      {/* Judul Warta */}
                      <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        <Link href={detailUrl}>
                          {item.judul}
                        </Link>
                      </h3>

                      {/* Ringkasan: Sembunyikan di mobile untuk menjaga simetri kartu */}
                      <p className="hidden sm:block text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {item.ringkasan || "Klik tautan di bawah untuk membaca warta paguyuban selengkapnya."}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Footer Link */}
                  <div className="p-3 pt-2 sm:px-5 sm:pb-4 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="hidden sm:inline text-slate-400 font-medium">
                      {isDuka ? "Salipuri Temmadinging" : "KKS Kab. Mimika"}
                    </span>
                    <Link
                      href={detailUrl}
                      className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-1 font-bold text-slate-800 hover:text-primary transition-colors group/link"
                    >
                      <span>Baca</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
