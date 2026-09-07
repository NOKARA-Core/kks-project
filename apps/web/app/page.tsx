import Link from "next/link";
import {
  db,
  wartaPaguyuban,
  kasSosial,
  direktoriNiaga,
  type WartaPaguyuban,
  type DirektoriNiaga,
  type KasSosial,
} from "@repo/database";
import { desc, eq, and } from "drizzle-orm";
import { HeroSection } from "../components/sections/HeroSection";
import { LeadershipGreeting } from "../components/sections/LeadershipGreeting";
import { WartaSection } from "../components/sections/WartaSection";
import { KasSosialSection } from "../components/sections/KasSosialSection";
import { NiagaSection } from "../components/sections/NiagaSection";
import { SecretariatMapSection } from "../components/sections/SecretariatMapSection";
import { ScrollReveal } from "../components/motion/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch 3 Warta Published Terbaru
  let latestWarta: WartaPaguyuban[] = [];
  try {
    latestWarta = await db
      .select()
      .from(wartaPaguyuban)
      .where(eq(wartaPaguyuban.statusTayang, "published"))
      .orderBy(desc(wartaPaguyuban.createdAt))
      .limit(3);
  } catch (error) {
    console.error("Error fetching latest warta:", error);
  }

  // 2. Fetch & Aggregate Kas Sosial
  let totalSaldo = 0;
  let totalSantunanKeluar = 0;
  let jumlahPenerimaSantunan = 0;
  let recentTransactions: KasSosial[] = [];
  try {
    const allKas = await db.select().from(kasSosial);
    let totalMasuk = 0;
    let totalKeluar = 0;

    for (const k of allKas) {
      const nom = Number(k.nominal) || 0;
      if (k.jenisTransaksi === "masuk") {
        totalMasuk += nom;
      } else {
        totalKeluar += nom;
        if (
          k.peruntukan === "santunan_duka" ||
          k.peruntukan === "kas_siaga"
        ) {
          totalSantunanKeluar += nom;
          jumlahPenerimaSantunan += 1;
        }
      }
    }
    totalSaldo = totalMasuk - totalKeluar;

    // Fetch 4 transaksi terbaru
    recentTransactions = await db
      .select()
      .from(kasSosial)
      .orderBy(desc(kasSosial.tanggalTransaksi), desc(kasSosial.createdAt))
      .limit(4);
  } catch (error) {
    console.error("Error aggregating kas sosial:", error);
  }

  // 3. Fetch 4 UMKM Warga Terverifikasi
  let verifiedNiaga: DirektoriNiaga[] = [];
  try {
    verifiedNiaga = await db
      .select()
      .from(direktoriNiaga)
      .where(
        and(
          eq(direktoriNiaga.isVerified, true),
          eq(direktoriNiaga.isActive, true)
        )
      )
      .orderBy(desc(direktoriNiaga.createdAt))
      .limit(4);
  } catch (error) {
    console.error("Error fetching verified niaga:", error);
  }

  return (
    <main className="w-full">
      {/* 1. Hero Section: Media Carousel & Editorial Headline */}
      <HeroSection />

      {/* 2. Banner Kompak: Sambutan & Apresiasi Ketua & Wakil Ketua */}
      <LeadershipGreeting />

      {/* 3. Warta Paguyuban, Lelayu & Agenda Terkini */}
      <WartaSection wartaList={latestWarta} />

      {/* 4. Transparansi Kas Sosial & Santunan Duka Terbuka */}
      <KasSosialSection
        totalSaldo={totalSaldo}
        totalSantunanKeluar={totalSantunanKeluar}
        jumlahPenerimaSantunan={jumlahPenerimaSantunan}
        recentTransactions={recentTransactions}
      />

      {/* 5. Direktori UMKM & Niaga Warga Rantau */}
      <NiagaSection niagaList={verifiedNiaga} />

      {/* 6. Tiga Pilar Luhur Komunitas di Rantau */}
      {/* 6. Tiga Pilar Luhur Komunitas di Rantau */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={0.05}>
            <div className="max-w-3xl mb-6 sm:mb-8 space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Falsafah Hidup di Rantau
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tiga Pilar Luhur Bugis-Soppeng di Bumi Amungsa
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Menjadi pedoman teguh para sesepuh, pengurus, dan seluruh perantau Soppeng dalam menjaga keluhuran budi, saling menopang, serta hidup berdampingan secara damai di Kabupaten Mimika.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Pilar 1: Dongiri Temmatipa */}
            <ScrollReveal delay={0.08} className="h-full">
              <div className="h-full p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-primary/40 transition-all hover:shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-primary flex items-center justify-center mb-4 font-bold text-base border border-rose-100 shadow-2xs">
                    1
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Dongiri Temmatipa</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                    Pengayoman & Bimbingan
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Para sesepuh dan pengurus aktif memberikan pengayoman moril, bimbingan usaha, serta arahan hidup bagi warga baru maupun yang telah lama bermukim di rantau.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                  Pilar Pengayoman Paguyuban
                </div>
              </div>
            </ScrollReveal>

            {/* Pilar 2: Salipuri Temmadinging */}
            <ScrollReveal delay={0.16} className="h-full">
              <div className="h-full p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-primary/40 transition-all hover:shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-primary flex items-center justify-center mb-4 font-bold text-base border border-rose-100 shadow-2xs">
                    2
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Salipuri Temmadinging</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                    Kepedulian Sosial & Duka
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Saling menyelimuti di kala dingin. Gerak cepat tanggap lelayu/duka, santunan warga sakit, dan gotong royong meringankan beban musibah sesama keluarga perantau.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                  Pilar Solidaritas & Kas Duka
                </div>
              </div>
            </ScrollReveal>

            {/* Pilar 3: Wesse Temmakapa */}
            <ScrollReveal delay={0.24} className="h-full">
              <div className="h-full p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-sky/40 transition-all hover:shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-dark flex items-center justify-center mb-4 font-bold text-base border border-sky-100 shadow-2xs">
                    3
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Wesse Temmakapa</h3>
                  <p className="text-xs text-sky-dark font-semibold uppercase tracking-wider mb-2">
                    Persatuan & Keharmonisan
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Menjaga kerukunan internal paguyuban serta menjunjung tinggi adat istiadat tanah tempat berpijak dengan menghormati masyarakat adat Papua di Mimika.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                  Pilar Kerukunan Antarwarga
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. Ajakan Pendataan Warga Rantau */}
      <section className="py-10 sm:py-14 bg-canvas-soft border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal delay={0.05}>
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Silaturahmi Warga
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                Belum Terdaftar di Buku Warga KKS Mimika?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed pb-4">
                Mari daftarkan diri dan keluarga Anda agar terhubung dengan sesama perantau Soppeng di sektor domisili Anda di Timika. Proses mudah, hangat, dan tanpa birokrasi kaku.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                <Link
                  href="/pendataan"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center"
                >
                  Formulir Pendaftaran Warga Rantau
                </Link>
                <Link
                  href="/profil"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold rounded-xl transition-all text-center shadow-2xs"
                >
                  Pelajari Struktur Paguyuban
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. Seksi Peta & Alamat Sekretariat KKS Mimika (Tepat di Atas Footer) */}
      <SecretariatMapSection />
    </main>
  );
}
