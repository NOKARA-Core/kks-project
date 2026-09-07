import Link from "next/link";
import { Store, MessageCircle, MapPin, ChevronRight, CheckCircle2, User } from "lucide-react";
import type { DirektoriNiaga } from "@repo/database/schema";
import { formatImageUrl } from "@/lib/formatImageUrl";
import { formatWhatsAppUrl } from "@/lib/utils";

interface NiagaSectionProps {
  niagaList: DirektoriNiaga[];
  className?: string;
}

export function NiagaSection({ niagaList, className = "" }: NiagaSectionProps) {
  return (
    <section className={`py-14 sm:py-20 bg-white border-b border-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Pemberdayaan Ekonomi Rantau
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Direktori UMKM & Jasa Warga Soppeng
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mendukung kemandirian ekonomi keluarga sesama perantau di Timika. Mari berbelanja dan bermitra dengan usaha sanak sekampung.
            </p>
          </div>

          <Link
            href="/niaga"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold hover:text-gold-dark group shrink-0"
          >
            <span>Buka Katalog Niaga Lengkap</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Business Grid */}
        {niagaList.length === 0 ? (
          <div className="p-12 text-center bg-canvas-soft rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">
              Belum ada data usaha warga yang diverifikasi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {niagaList.map((item) => {
              const imageSrc = formatImageUrl(item.fotoUsahaUrl, "/placeholder-kks.webp");
              const waUrl = formatWhatsAppUrl(
                item.waBisnis,
                `Halo ${item.namaPemilik}, saya melihat usaha "${item.namaUsaha}" Anda melalui Direktori Niaga KKS Timika.`
              );

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image (aspect-4/3 w-full object-cover rounded-t-xl) */}
                    <div className="relative w-full aspect-4/3 overflow-hidden bg-slate-100 rounded-t-xl sm:rounded-t-2xl">
                      <img
                        src={imageSrc}
                        alt={item.namaUsaha}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5">
                        <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/95 text-slate-800 backdrop-blur-xs shadow-2xs border border-slate-200 truncate max-w-[110px] inline-block">
                          {item.kategoriUsaha}
                        </span>
                      </div>
                    </div>

                    {/* Content (p-2.5 sm:p-4) */}
                    <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-gold transition-colors">
                        {item.namaUsaha}
                      </h3>

                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-sky-600 font-medium truncate">
                        <User className="w-3 h-3 text-sky-500 shrink-0" />
                        <span className="truncate">{item.namaPemilik}</span>
                      </div>

                      <div className="flex items-start gap-1 text-[10px] sm:text-xs text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item.alamatUsaha}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA (h-8 sm:h-9 text-[11px] sm:text-xs w-full mt-2 rounded-lg bg-emerald-600) */}
                  <div className="p-2.5 pt-0 sm:p-4 sm:pt-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 sm:h-9 text-[11px] sm:text-xs w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 font-medium transition-all shadow-2xs"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Hubungi WA</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner Ajakan Daftarkan Usaha */}
        <div className="p-6 rounded-2xl bg-canvas-soft border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              Punya Usaha atau Jasa di Timika?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Daftarkan gerai atau produk Anda ke Direktori Niaga Warga KKS secara gratis.
            </p>
          </div>
          <Link
            href="/niaga#daftar-usaha"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition shrink-0 shadow-xs"
          >
            <span>Daftarkan Usaha Anda</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
