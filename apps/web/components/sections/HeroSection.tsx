import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, HeartHandshake, Calendar, Store, Users, MapPin, ShieldCheck } from 'lucide-react';
import { db, heroSlides, type HeroSlide } from '@repo/database';
import { asc, desc, eq } from 'drizzle-orm';
import { HeroCarousel } from '../HeroCarousel';
import { ScrollReveal } from '../motion/ScrollReveal';

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
    <section className="relative bg-canvas-soft border-b border-slate-200/80 overflow-hidden pt-8 sm:pt-12 pb-10 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================================
            SLOT ATAS: DYNAMIC HERO MEDIA CAROUSEL (ADMIN MANAGED)
            ========================================================= */}
        <ScrollReveal delay={0}>
          <div className="w-full mb-8 sm:mb-12">
            <HeroCarousel slides={slides} />
          </div>
        </ScrollReveal>


        {/* =========================================================
            EDITORIAL NEWS GRID: HEADLINE UTAMA & WARTA RINGKAS
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Kolom Kiri: Headline Utama Editorial (7 Kolom) */}
          <article className="lg:col-span-7 flex flex-col justify-center">
            <ScrollReveal delay={0.1}>
              {/* Metadata Editorial (Tanpa Badge Style) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">
                <span className="text-primary font-extrabold">Warta Utama</span>
                <span>&bull;</span>
                <time dateTime="2026-09-07">Senin, 7 September 2026</time>
                <span>&bull;</span>
                <span>Kabupaten Mimika</span>
              </div>

              {/* H1 SEO Friendly - Law of Proximity (space-y rapat ke deskripsi) */}
              <div className="space-y-3 mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
                  Menjaga Kerukunan, Mengayomi Sesama Perantau Soppeng di Tanah Mimika
                </h1>

                {/* Lead Paragraph Informatif */}
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Portal resmi Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika. Menghidupkan falsafah leluhur{' '}
                  <strong className="text-slate-900 font-semibold">Dongiri Temmatipa</strong> (pengayoman),{' '}
                  <strong className="text-slate-900 font-semibold">Salipuri Temmadinging</strong> (kepedulian sosial & duka), serta{' '}
                  <strong className="text-slate-900 font-semibold">Wesse Temmakapa</strong> (kerukunan hidup berdampingan secara damai di Papua Tengah).
                </p>
              </div>

              {/* Tombol Aksi Bersih & Fungsional (Standar Touch Target: h-12 / 48px, px-6 / 24px, rounded-xl) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link
                  href="/pendataan"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center text-sm sm:text-base"
                >
                  <span>Daftar Warga Rantau</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/warta"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl transition-all hover:bg-slate-50 text-center text-sm sm:text-base"
                >
                  <span>Telusuri Warta Komunitas</span>
                </Link>
              </div>

              {/* Data Metrik Informatif Ringkas (Micro-Stats Hero - 8-Point Grid: p-3 di mobile, p-4 di desktop, min-h-[72px] sm:min-h-[80px]) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-slate-200">
                <div className="bg-white/90 border border-slate-200/80 rounded-xl p-3 sm:p-4 min-h-[72px] sm:min-h-[80px] text-center sm:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shadow-2xs">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 p-1.5 sm:p-2 rounded-lg bg-rose-50 border border-rose-100 shrink-0 text-primary flex items-center justify-center">
                    <Users className="w-full h-full" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">450+</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight truncate w-full">KK Terdaftar</span>
                  </div>
                </div>

                <div className="bg-white/90 border border-slate-200/80 rounded-xl p-3 sm:p-4 min-h-[72px] sm:min-h-[80px] text-center sm:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shadow-2xs">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 p-1.5 sm:p-2 rounded-lg bg-rose-50 border border-rose-100 shrink-0 text-primary flex items-center justify-center">
                    <MapPin className="w-full h-full" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">12</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight truncate w-full">Sektor Wilayah</span>
                  </div>
                </div>

                <div className="bg-white/90 border border-slate-200/80 rounded-xl p-3 sm:p-4 min-h-[72px] sm:min-h-[80px] text-center sm:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shadow-2xs">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 p-1.5 sm:p-2 rounded-lg bg-sky-50 border border-sky-100 shrink-0 text-sky-600 flex items-center justify-center">
                    <ShieldCheck className="w-full h-full" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-lg font-bold text-sky-900 tracking-tight">24 Jam</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight truncate w-full">Kas Duka Siaga</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </article>

          {/* Kolom Kanan: Kilas Warta Terkini & Agenda Penting (5 Kolom) */}
          <aside className="lg:col-span-5 flex flex-col gap-4">
            <ScrollReveal delay={0.15}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Kilas Warta & Agenda Warga
                </h2>
                <Link href="/warta" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Warta 1: Kabar Duka & Lelayu (Prioritas Tinggi) */}
            <ScrollReveal delay={0.2}>
              <Link
                href="/warta#duka"
                className="group block p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Kabar Duka & Lelayu</span>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  Layanan Tanggap Duka Paguyuban KKS Mimika Siap Mendampingi Warga
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  Informasi santunan lelayu, armada pendampingan, dan kontak pengurus sektor rujukan rumah duka di Timika.
                </p>
              </Link>
            </ScrollReveal>

            {/* Warta 2: Agenda Pertemuan Rutin */}
            <ScrollReveal delay={0.25}>
              <Link
                href="/warta#agenda"
                className="group block p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agenda Silaturahmi</span>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  Pertemuan Bulanan Pengurus & Warga Sektor Distrik Mimika Baru
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  Rapat koordinasi berkala mempererat persaudaraan dan pembaharuan buku data warga perantau.
                </p>
              </Link>
            </ScrollReveal>

            {/* Warta 3: Niaga Rantau / UMKM */}
            <ScrollReveal delay={0.3}>
              <Link
                href="/niaga"
                className="group block p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/60">
                    <Store className="w-3.5 h-3.5" />
                    <span>Pojok Niaga Perantau</span>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  Dukungan Usaha Kuliner & Jasa Sesama Warga Soppeng di Timika
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  Katalog usaha lokal perantau. Mari berbelanja dan saling menguatkan ekonomi sesama warga.
                </p>
              </Link>
            </ScrollReveal>

          </aside>

        </div>

      </div>
    </section>
  );
}
