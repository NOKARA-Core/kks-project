import type { Metadata } from "next";
import { getHeroSlides } from "@/app/actions/hero-slides";
import { HeroBannerManager } from "@/components/hero/HeroBannerManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manajemen Hero Banner Beranda — Admin KKS Mimika",
  description: "Kelola foto slide banner utama dan pengumuman visual pada carousel beranda portal publik.",
};

export default async function HeroBannerPage() {
  const slides = await getHeroSlides();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <HeroBannerManager initialSlides={slides} />
    </div>
  );
}
