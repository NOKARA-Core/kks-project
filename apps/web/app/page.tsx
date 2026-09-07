import Link from "next/link";
import {
  db,
  wartaPaguyuban,
  kasSosial,
  direktoriNiaga,
  type WartaPaguyuban,
  type DirektoriNiaga,
} from "@repo/database";
import { desc, eq, and } from "drizzle-orm";
import { HeroSection } from "../components/sections/HeroSection";
import { LeadershipGreeting } from "../components/sections/LeadershipGreeting";
import { WartaSection } from "../components/sections/WartaSection";
import { KasSosialSection } from "../components/sections/KasSosialSection";
import { NiagaSection } from "../components/sections/NiagaSection";

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
      />

      {/* 5. Direktori UMKM & Niaga Warga Rantau */}
      <NiagaSection niagaList={verifiedNiaga} />

      {/* 6. Tiga Pilar Luhur Komunitas di Rantau */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Falsafah Hidup di Rantau
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
              Tiga Pilar Luhur Bugis-Soppeng di Bumi Amungsa
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Menjadi pedoman teguh para sesepuh, pengurus, dan seluruh perantau Soppeng dalam menjaga keluhuran budi, saling menopang, serta hidup berdampingan secara damai di Kabupaten Mimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pilar 1: Dongiri Temmatipa */}
            <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-gold/50 transition-all hover:shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-5 font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dongiri Temmatipa</h3>
                <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-3">
                  Pengayoman & Bimbingan
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Para sesepuh dan pengurus aktif memberikan pengayoman moril, bimbingan usaha, serta arahan hidup bagi warga baru maupun yang telah lama bermukim di rantau.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                Pilar Pengayoman Paguyuban
              </div>
            </div>

            {/* Pilar 2: Salipuri Temmadinging */}
            <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-siri/40 transition-all hover:shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-siri/10 text-siri flex items-center justify-center mb-5 font-bold text-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Salipuri Temmadinging</h3>
                <p className="text-xs text-siri font-semibold uppercase tracking-wider mb-3">
                  Kepedulian Sosial & Duka
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Saling menyelimuti di kala dingin. Gerak cepat tanggap lelayu/duka, santunan warga sakit, dan gotong royong meringankan beban musibah sesama keluarga perantau.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                Pilar Solidaritas & Kas Duka
              </div>
            </div>

            {/* Pilar 3: Wesse Temmakapa */}
            <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-slate-200/80 hover:border-sky/50 transition-all hover:shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky/10 text-sky-dark flex items-center justify-center mb-5 font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Wesse Temmakapa</h3>
                <p className="text-xs text-sky-dark font-semibold uppercase tracking-wider mb-3">
                  Persatuan & Keharmonisan
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Menjaga kerukunan internal paguyuban serta menjunjung tinggi adat istiadat tanah tempat berpijak dengan menghormati masyarakat adat Papua di Mimika.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-500">
                Pilar Kerukunan Antarwarga
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Ajakan Pendataan Warga Rantau */}
      <section className="py-16 sm:py-20 bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Silaturahmi Warga
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-4">
              Belum Terdaftar di Buku Warga KKS Mimika?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Mari daftarkan diri dan keluarga Anda agar terhubung dengan sesama perantau Soppeng di sektor domisili Anda di Timika. Proses mudah, hangat, dan tanpa birokrasi kaku.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/pendataan"
                className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center"
              >
                Formulir Pendaftaran Warga Rantau
              </Link>
              <Link
                href="/profil"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold rounded-xl transition-all text-center shadow-2xs"
              >
                Pelajari Struktur Paguyuban
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
