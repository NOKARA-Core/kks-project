import type { Metadata } from "next";
import {
  Store,
  MessageCircle,
  MapPin,
  Tag,
  PlusCircle,
  CheckCircle,
  Phone,
  Search,
} from "lucide-react";
import { db, direktoriNiaga } from "@repo/database";
import { siteConfig } from "@/lib/config";
import { formatWhatsAppUrl } from "@/lib/utils";
import { eq, desc } from "drizzle-orm";



export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Niaga Rantau — Direktori Usaha Warga",
  description:
    "Direktori usaha, jasa, dan UMKM sesama perantau asal Kabupaten Soppeng di Timika, Papua Tengah. Saling menguatkan ekonomi keluarga perantau.",
};

export default async function NiagaPage() {
  const businesses = await db
    .select()
    .from(direktoriNiaga)
    .where(eq(direktoriNiaga.isActive, true))
    .orderBy(desc(direktoriNiaga.createdAt));

  return (
    <main className="w-full pb-20">
      {/* Header Halaman */}
      <header className="bg-canvas-soft border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Ekonomi Rantau Mimika
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
              Direktori Niaga & Jasa Warga KKS Timika
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Etalase usaha dan jasa sesama perantau Soppeng di Kabupaten Mimika. Mari
              berbelanja dan saling menguatkan perekonomian keluarga warga di tanah rantau.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#daftar-usaha"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-red-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Daftarkan Usaha Anda Gratis</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 flex flex-col gap-16">
        {/* 1. KATALOG USAHA */}
        <section>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Daftar Usaha Warga Terverifikasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Daftar usaha milik sesama warga perantau Soppeng yang beroperasi di wilayah Timika.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              {businesses.length} Usaha Terdaftar
            </span>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                Belum Ada Usaha Ditampilkan
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Daftarkan usaha atau gerai jasa Anda melalui formulir di bawah agar dapat
                dijangkau ribuan warga perantau di Timika.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {businesses.map((biz) => {
                const cleanWa = biz.waBisnis.replace(/\D/g, "");
                const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
                  `Halo Tabe', saya warga KKS Timika melihat gerai usaha "${biz.namaUsaha}" Anda di Portal Direktori Niaga KKS.`
                )}`;

                return (
                  <article
                    key={biz.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all hover:shadow-card flex flex-col overflow-hidden group"
                  >
                    {/* 16:9 Thumbnail Photo */}
                    <div className="w-full aspect-16/9 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                      {biz.fotoUsahaUrl ? (
                        <img
                          src={biz.fotoUsahaUrl}
                          alt={biz.namaUsaha}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                          <Store className="w-8 h-8 stroke-1" />
                          <span className="text-[10px] mt-1 font-medium">
                            KKS Niaga Rantau
                          </span>
                        </div>
                      )}

                      {/* Category Badge overlay */}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold bg-white/95 backdrop-blur-xs text-slate-800 px-2.5 py-1 rounded-lg shadow-xs border border-slate-200/50">
                        <Tag className="w-3 h-3 text-red-600" />
                        {biz.kategoriUsaha}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-red-700 transition">
                            {biz.namaUsaha}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <span>Pemilik:</span>
                          <span className="font-semibold text-slate-800">
                            {biz.namaPemilik}
                          </span>
                          {biz.isVerified && (
                            <span className="inline-flex items-center text-emerald-600 text-[10px] font-bold gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                              <CheckCircle className="w-3 h-3" />
                              Terverifikasi
                            </span>
                          )}
                        </div>

                        {biz.deskripsi && (
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {biz.deskripsi}
                          </p>
                        )}

                        <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{biz.alamatUsaha}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">
                          {biz.waBisnis}
                        </span>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 2. FORM PENDAFTARAN USAHA (#daftar-usaha) */}
        <section id="daftar-usaha" className="scroll-mt-28 pt-8 border-t border-slate-100">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Promosi Usaha Warga
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
                Daftarkan Usaha & Jasa Anda
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
                Khusus untuk warga perantau asal Kabupaten Soppeng di Kabupaten Mimika. Usaha
                Anda akan diverifikasi dan ditampilkan di direktori ini gratis tanpa biaya retribusi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Untuk mendaftarkan usaha Anda lengkap dengan foto tempat usaha, silakan hubungi tim
                Biro Ekonomi & Niaga KKS Timika melalui WhatsApp resmi di bawah:
              </p>
              <a
                href={formatWhatsAppUrl(
                  siteConfig.hotlineWa,
                  "Halo Admin KKS Timika, saya ingin mendaftarkan usaha saya ke Direktori Niaga Warga."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Biro Ekonomi KKS via WhatsApp</span>
              </a>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
