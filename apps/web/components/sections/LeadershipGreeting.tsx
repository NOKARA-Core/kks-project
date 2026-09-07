import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Award } from "lucide-react";

export function LeadershipGreeting() {
  return (
    <section className="bg-canvas-soft pt-4 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            
            {/* Sisi Kiri: Profil Singkat Ketua & Wakil Ketua */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 lg:border-r lg:border-slate-200/80 lg:pr-8">
              {/* Avatar Pair */}
              <div className="flex items-center -space-x-3">
                {/* Ketua Avatar */}
                <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-xs">
                  <Image
                    src="/foto-cwo.jpg"
                    alt="Firman Amali - Ketua Umum KKS Mimika"
                    width={56}
                    height={56}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                  <span
                    title="Ketua Umum"
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-extrabold border-2 border-white shadow-2xs"
                  >
                    1
                  </span>
                </div>

                {/* Wakil Ketua Avatar */}
                <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 p-0.5 shadow-xs">
                  <Image
                    src="/foto-cwe.jpg"
                    alt="xxxxxxxx - Wakil Ketua KKS Mimika"
                    width={56}
                    height={56}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                  <span
                    title="Wakil Ketua"
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 text-slate-100 flex items-center justify-center text-[10px] font-extrabold border-2 border-white shadow-2xs"
                  >
                    2
                  </span>
                </div>
              </div>

              {/* Nama & Jabatan */}
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px] font-bold">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>Badan Pengurus Harian KKS Mimika</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  Firman Amali
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Ketua Umum &bull; <span className="text-slate-500">xxxxxxxx (Wakil Ketua)</span>
                </p>
              </div>
            </div>

            {/* Sisi Tengah / Kanan: Pesan Persatuan & Sambutan Ringkas */}
            <div className="grow space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  Sambutan Pengurus Paguyuban
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-600 font-medium italic">
                  Yassisoppengi di Tanah Amungsa
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                &ldquo;Selamat datang di portal silaturahmi warga Soppeng di Kabupaten Mimika. Mari kita kokohkan simpul persaudaraan, saling mengayomi (<em className="font-semibold text-slate-800 not-italic">Dongiri Temmatipa</em>), siaga mendampingi di saat duka (<em className="font-semibold text-slate-800 not-italic">Salipuri Temmadinging</em>), dan hidup berdampingan secara damai serta harmonis (<em className="font-semibold text-slate-800 not-italic">Wesse Temmakapa</em>).&rdquo;
              </p>
            </div>

            {/* Sisi Aksi: Link Profil Pengurus Lengkap */}
            <div className="shrink-0 self-start sm:self-auto">
              <Link
                href="/profil#pengurus"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition shadow-2xs group"
              >
                <span>Struktur Pengurus Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
