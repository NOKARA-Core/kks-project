"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { HeroSlide } from "@repo/database/schema";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  // Default fallback slide jika slides kosong
  const displaySlides: HeroSlide[] =
    slides.length > 0
      ? slides
      : [
          {
            id: "fallback-slide",
            imageUrl: "/images/hero-banner.png",
            title: "Musyawarah & Temu Warga Kerukunan Keluarga Soppeng (KKS) Kabupaten Mimika",
            subtitle:
              "Dokumentasi silaturahmi akbar dan kebersamaan perantau Soppeng di Tanah Amungsa/Mimika, Papua Tengah.",
            badgeTag: "Dokumentasi Warta Paguyuban",
            targetUrl: "/warta",
            orderIndex: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

  const total = displaySlides.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play interval: 5.5 detik, pause saat kursor hover
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [total, isHovered, nextSlide]);

  const currentSlide = displaySlides[currentIndex]!;

  const slideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      transition: {
        duration: 0.4,
        ease: "easeIn" as const,
      },
    }),
  };


  const ContentWrapper = currentSlide.targetUrl
    ? ({ children }: { children: React.ReactNode }) => (
        <Link
          href={currentSlide.targetUrl!}
          className="block w-full h-full cursor-pointer"
        >
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <div
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] min-h-[220px] max-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide.id}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <ContentWrapper>
            {/* Background Image */}
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title || "Banner Paguyuban"}
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            />

            {/* Overlay Gradien Halus */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
              {/* Badge Tag */}
              {currentSlide.badgeTag && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-bold text-amber-300 tracking-wider uppercase mb-1 sm:mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-300/30 backdrop-blur-xs">
                    {currentSlide.badgeTag}
                  </span>
                  <span className="text-white/60 hidden sm:inline">&bull;</span>
                  <span className="text-white/80 hidden sm:inline">Kabupaten Mimika</span>
                </div>
              )}

              {/* Slide Title */}
              {currentSlide.title && (
                <p className="text-white font-extrabold text-sm sm:text-lg md:text-2xl leading-snug drop-shadow-sm max-w-3xl line-clamp-2">
                  {currentSlide.title}
                </p>
              )}

              {/* Subtitle / Caption */}
              {currentSlide.subtitle && (
                <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl hidden md:line-clamp-2 leading-relaxed">
                  {currentSlide.subtitle}
                </p>
              )}

              {currentSlide.targetUrl && (
                <div className="mt-2 hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white transition-colors">
                  <span>Lihat Selengkapnya</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </div>
          </ContentWrapper>
        </motion.div>
      </AnimatePresence>

      {/* Navigasi Panah Kiri & Kanan (Hover Only, Minimalis & Transparan) */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide Sebelumnya"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer focus:outline-hidden hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900" />
          </button>

          <button
            type="button"
            aria-label="Slide Selanjutnya"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer focus:outline-hidden hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 text-slate-900" />
          </button>
        </>
      )}

      {/* Indikator Pill/Dots di Pojok Kanan Bawah */}
      {total > 1 && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/40 backdrop-blur-xs border border-white/10">
          {displaySlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Pindah ke slide ${idx + 1}`}
              onClick={(e) => {
                e.preventDefault();
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-rose-500 shadow-xs"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
