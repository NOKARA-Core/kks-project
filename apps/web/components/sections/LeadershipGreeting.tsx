import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Award } from "lucide-react";
import { ScrollReveal } from "../motion/ScrollReveal";

export function LeadershipGreeting() {
  return (
    <section className="bg-canvas-soft py-5 sm:py-7 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={0.05}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 lg:gap-8">
            
            {/* Sisi Kiri: Profil Singkat Ketua & Wakil Ketua */}
            <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-4 shrink-0 lg:border-r lg:border-slate-200/80 lg:pr-8">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Avatar Pair (Overlapping & Compact - 48px / 64px kelipatan 8) */}
                <div className="flex items-center -space-x-3 sm:-space-x-4 shrink-0">
                  {/* Ketua Avatar */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full sm:rounded-2xl border-2 border-primary/40 bg-rose-50 shadow-xs overflow-hidden shrink-0">
                    <Image
                      src="/foto-cwo.jpg"
                      alt="Firman Amali - Ketua Umum KKS Mimika"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <span
                      title="Ketua Umum"
                      className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold border-2 border-white shadow-2xs"
                    >
                      1
                    </span>
                  </div>

                  {/* Wakil Ketua Avatar */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full sm:rounded-2xl border-2 border-slate-300 bg-slate-100 shadow-xs overflow-hidden shrink-0">
                    <Image
                      src="/foto-cwe.jpg"
                      alt="xxxxxxxx - Wakil Ketua KKS Mimika"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <span
                      title="Wakil Ketua"
                      className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-700 text-slate-100 flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold border-2 border-white shadow-2xs"
                    >
                      2
                    </span>
                  </div>
                </div>

                {/* Nama & Jabatan (Law of Proximity: space-y-1) */}
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/70 text-primary text-[10px] sm:text-[11px] font-bold">
                    <Award className="w-3 h-3 text-primary shrink-0" />
                    <span className="truncate">Badan Pengurus Harian</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug truncate">
                    Firman Amali
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
                    Ketua Umum &bull; <span className="text-slate-500">xxxxxxxx (Wakil)</span>
                  </p>
                </div>
              </div>

              {/* Tautan Pengurus Mobile (Touch target: h-11 w-11 / 44px) */}
              <Link
                href="/profil#pengurus"
                className="lg:hidden shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
                title="Struktur Pengurus Lengkap"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Sisi Tengah: Pesan Persatuan & Sambutan Ringkas (space-y-2) */}
            <div className="grow space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                  Sambutan Pengurus
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium italic">
                  Yassisoppengi di Tanah Amungsa
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-none">
                &ldquo;Selamat datang di portal silaturahmi warga Soppeng di Kabupaten Mimika. Mari kita kokohkan simpul persaudaraan, saling mengayomi (<em className="font-semibold text-slate-800 not-italic">Dongiri Temmatipa</em>), siaga mendampingi di saat duka (<em className="font-semibold text-slate-800 not-italic">Salipuri Temmadinging</em>), dan hidup berdampingan secara damai serta harmonis (<em className="font-semibold text-slate-800 not-italic">Wesse Temmakapa</em>).&rdquo;
              </p>
            </div>

            {/* Sisi Kanan: Link Profil Pengurus Lengkap (Desktop Only: h-11 / 44px, px-6 / 24px) */}
            <div className="hidden lg:block shrink-0">
              <Link
                href="/profil#pengurus"
                className="inline-flex items-center gap-2 h-11 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition shadow-2xs group"
              >
                <span>Struktur Pengurus Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
