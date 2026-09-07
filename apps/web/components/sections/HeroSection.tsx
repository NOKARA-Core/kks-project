import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, HeartHandshake, Calendar, Store, Users, MapPin, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-canvas-soft border-b border-slate-200/80 overflow-hidden pt-6 sm:pt-8 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================================
            SLOT ATAS: GAMBAR / BANNER INFORMASI / IKLAN (ADMIN SLOT)
            ========================================================= */}
        <div className="w-full mb-8 sm:mb-12">
          <div className="group relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] min-h-[180px] max-h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <img
              src="/images/hero-banner.png"
              alt="Dokumentasi Silaturahmi Kerukunan Keluarga Soppeng Mimika"
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            />
            
            {/* Overlay Gradien Halus */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-200 tracking-wider uppercase mb-1">
                <span>Dokumentasi Warta Paguyuban</span>
                <span className="hidden sm:inline">&bull;</span>
                <span className="text-white/80 hidden sm:inline">Tanah Amungsa, Mimika</span>
              </div>
              <p className="text-white font-bold text-base sm:text-xl md:text-2xl leading-snug drop-shadow-sm max-w-3xl">
                Musyawarah & Temu Warga Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika
              </p>
              <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl hidden md:block">
                Slot penayangan foto liputan akbar komunitas, pengumuman resmi, atau sponsorship UMKM warga yang dikelola melalui panel admin.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            EDITORIAL NEWS GRID: HEADLINE UTAMA & WARTA RINGKAS
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Kolom Kiri: Headline Utama Editorial (7 Kolom) */}
          <article className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Metadata Editorial (Tanpa Badge Style) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">
              <span className="text-gold">Warta Utama</span>
              <span>&bull;</span>
              <time dateTime="2026-09-07">Senin, 7 September 2026</time>
              <span>&bull;</span>
              <span>Kabupaten Mimika</span>
            </div>

            {/* H1 SEO Friendly */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-5">
              Menjaga Kerukunan, Mengayomi Sesama Perantau Soppeng di Tanah Mimika
            </h1>

            {/* Lead Paragraph Informatif */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Portal resmi Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Menghidupkan falsafah leluhur{' '}
              <strong className="text-slate-900 font-semibold">Dongiri Temmatipa</strong> (pengayoman),{' '}
              <strong className="text-slate-900 font-semibold">Salipuri Temmadinging</strong> (kepedulian sosial & duka), serta{' '}
              <strong className="text-slate-900 font-semibold">Wesse Temmakapa</strong> (kerukunan hidup berdampingan secara damai di Papua Tengah).
            </p>

            {/* Tombol Aksi Bersih & Fungsional */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10">
              <Link
                href="/pendataan"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center text-sm sm:text-base"
              >
                <span>Daftar Warga Rantau</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/warta"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl transition-all hover:bg-slate-50 text-center text-sm sm:text-base"
              >
                <span>Telusuri Warta Komunitas</span>
              </Link>
            </div>

            {/* Data Metrik Informatif Ringkas */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-2xl sm:text-3xl">
                  <Users className="w-4 h-4 text-slate-400 hidden sm:inline" />
                  <span>450+</span>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">KK Terdaftar</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-2xl sm:text-3xl">
                  <MapPin className="w-4 h-4 text-slate-400 hidden sm:inline" />
                  <span>12</span>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Sektor Wilayah</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-sky-dark font-extrabold text-2xl sm:text-3xl">
                  <ShieldCheck className="w-4 h-4 text-sky hidden sm:inline" />
                  <span>Siaga 24 Jam</span>
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Layanan Kas Duka</span>
              </div>
            </div>

          </article>

          {/* Kolom Kanan: Kilas Warta Terkini & Agenda Penting (5 Kolom) */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Kilas Warta & Agenda Warga
              </h2>
              <Link href="/warta" className="text-xs font-semibold text-gold hover:underline flex items-center gap-0.5">
                Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Warta 1: Kabar Duka & Lelayu (Prioritas Tinggi) */}
            <Link
              href="/warta#duka"
              className="group block p-4 bg-white rounded-xl border-l-4 border-l-siri border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-siri uppercase tracking-wide mb-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Kabar Duka & Santunan Lelayu</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-gold transition-colors line-clamp-2 mb-1">
                Layanan Tanggap Duka Paguyuban KKS Mimika Siap Mendampingi Warga
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                Informasi santunan lelayu, armada pendampingan, dan kontak pengurus sektor rujukan rumah duka di Timika.
              </p>
            </Link>

            {/* Warta 2: Agenda Pertemuan Rutin */}
            <Link
              href="/warta#agenda"
              className="group block p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>Agenda Silaturahmi</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-gold transition-colors line-clamp-2 mb-1">
                Pertemuan Bulanan Pengurus & Warga Sektor Distrik Mimika Baru
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                Rapat koordinasi berkala mempererat persaudaraan dan pembaharuan buku data warga perantau.
              </p>
            </Link>

            {/* Warta 3: Niaga Rantau / UMKM */}
            <Link
              href="/niaga"
              className="group block p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                <Store className="w-3.5 h-3.5 text-sky" />
                <span>Pojok Niaga Perantau</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-gold transition-colors line-clamp-2 mb-1">
                Dukungan Usaha Kuliner & Jasa Sesama Warga Soppeng di Timika
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                Katalog usaha lokal perantau. Mari berbelanja dan saling menguatkan ekonomi sesama warga.
              </p>
            </Link>

          </aside>

        </div>

      </div>
    </section>
  );
}
