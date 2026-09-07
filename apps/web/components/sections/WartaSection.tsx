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
    <section className={`py-14 sm:py-20 bg-white border-b border-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
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
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold hover:text-gold-dark group shrink-0"
          >
            <span>Buka Seluruh Warta</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid Kartu Warta Dinamis (Anti AI-Slop: Modern Enterprise Card) */}
        {wartaList.length === 0 ? (
          <div className="p-12 text-center bg-canvas-soft rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">
              Belum ada warta terbaru yang diterbitkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {wartaList.map((item) => {
              const isDuka = item.kategori === "duka_cita";
              const isAgenda = item.kategori === "agenda_kegiatan";
              const isSuka = item.kategori === "suka_cita";

              const badgeClass = isDuka
                ? "bg-rose-50 text-rose-700 border-rose-100"
                : isAgenda
                ? "bg-sky-50 text-sky-700 border-sky-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100";

              const badgeLabel = isDuka
                ? "Kabar Duka (Lelayu)"
                : isAgenda
                ? "Agenda & Turnamen"
                : "Kabar Suka Cita";

              const detailUrl = `/warta/${item.slug || item.id}`;
              const imageSrc = formatImageUrl(item.fotoUtamaUrl, "/placeholder-kks.webp");

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Cover */}
                    <div className="relative w-full aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={imageSrc}
                        alt={item.judul}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Top Overlay Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-xs shadow-2xs ${badgeClass}`}
                        >
                          {isDuka && <HeartHandshake className="w-3 h-3" />}
                          {isAgenda && <Calendar className="w-3 h-3" />}
                          {isSuka && <Sparkles className="w-3 h-3" />}
                          <span>{badgeLabel}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      {/* Meta Waktu & Lokasi */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <time dateTime={item.createdAt.toISOString()}>
                            {formatTanggal(item.createdAt)}
                          </time>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {item.lokasiNamaTempat || item.alamatDukaTimika || "Timika"}
                          </span>
                        </span>
                      </div>

                      {/* Judul Warta */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                        <Link href={detailUrl}>
                          {item.judul}
                        </Link>
                      </h3>

                      {/* Ringkasan */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {item.ringkasan || "Klik tautan di bawah untuk membaca warta paguyuban selengkapnya."}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Footer Link */}
                  <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {isDuka ? "Salipuri Temmadinging" : "KKS Kab. Mimika"}
                    </span>
                    <Link
                      href={detailUrl}
                      className="inline-flex items-center gap-1 font-bold text-slate-800 hover:text-gold transition-colors group/link"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
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
