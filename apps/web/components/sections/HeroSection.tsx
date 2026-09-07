import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, HeartHandshake, Calendar, Store, Users, MapPin, ShieldCheck } from 'lucide-react';
import { db, heroSlides, type HeroSlide } from '@repo/database';
import { asc, desc, eq } from 'drizzle-orm';
import { HeroCarousel } from '../HeroCarousel';

export async function HeroSection() {
  let slides: HeroSlide[] = [];
  try {
    slides = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(asc(heroSlides.orderIndex), desc(heroSlides.createdAt));
  } catch (error) {
    console.error("Error fetching hero slides in HeroSection:", error);
  }

  return (
    <section className="relative bg-canvas-soft border-b border-slate-200/80 overflow-hidden pt-6 sm:pt-8 pb-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================================
            SLOT ATAS: DYNAMIC HERO MEDIA CAROUSEL (ADMIN MANAGED)
            ========================================================= */}
        <div className="w-full mb-8 sm:mb-12">
          <HeroCarousel slides={slides} />
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
              className="group block p-4.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Kabar Duka & Lelayu</span>
                </span>
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
              className="group block p-4.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agenda Silaturahmi</span>
                </span>
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
              className="group block p-4.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                  <Store className="w-3.5 h-3.5" />
                  <span>Pojok Niaga Perantau</span>
                </span>
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
