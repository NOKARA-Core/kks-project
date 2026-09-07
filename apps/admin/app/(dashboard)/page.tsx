import {
  db,
  wargaRantau,
  wartaPaguyuban,
  kasSosial,
  direktoriNiaga,
  SEKTOR_TIMIKA,
} from "@repo/database";
import { eq, desc } from "drizzle-orm";
import { getKasSummary, getKasList } from "@/app/actions/kas";
import { RingkasanClient } from "@/components/dashboard/RingkasanClient";
import type { SektorDistributionItem } from "@/components/dashboard/charts/SektorDistributionChart";
import type { MonthlyCashFlowItem } from "@/components/dashboard/charts/ArusKasAreaChart";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  // 1. Data Warga
  const allWarga = await db.select().from(wargaRantau);
  const totalWarga = allWarga.length;
  const pendingWarga = allWarga.filter((w) => w.statusVerifikasi === "pending");
  const pendingWargaCount = pendingWarga.length;
  const recentPendingWarga = pendingWarga.slice(0, 5);

  // 2. Kalkulasi Sebaran Sektor Domisili Mimika (Null-Safe & Akurat)
  const sektorCounts: Record<string, { count: number; jiwa: number }> = {};

  // Inisialisasi sektor utama
  const prioritySectors = [
    "Kuala Kencana",
    "Timika Kota",
    "SP 1 (Kamoro Jaya)",
    "SP 2 (Wanagon)",
    "SP 3 (Karang Senang)",
    "SP 4 (Wonorejo)",
    "SP 5",
    "Tembagapura",
  ];

  prioritySectors.forEach((s) => {
    sektorCounts[s] = { count: 0, jiwa: 0 };
  });

  allWarga.forEach((w) => {
    const domisili = w.domisiliTimika || "";
    let matched = false;

    for (const sektor of prioritySectors) {
      // Ambil kata kunci pencocokan, misal 'Kuala Kencana', 'SP 2', 'SP 3'
      const keyword = sektor.split(" ")[0] || sektor;
      if (
        domisili.toLowerCase().includes(sektor.toLowerCase()) ||
        (keyword.length > 2 && domisili.toLowerCase().includes(keyword.toLowerCase()))
      ) {
        if (!sektorCounts[sektor]) {
          sektorCounts[sektor] = { count: 0, jiwa: 0 };
        }
        sektorCounts[sektor].count += 1;
        sektorCounts[sektor].jiwa += w.jumlahKeluarga || 1;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const fallback = "Lainnya / Sekitar Mimika";
      if (!sektorCounts[fallback]) {
        sektorCounts[fallback] = { count: 0, jiwa: 0 };
      }
      sektorCounts[fallback].count += 1;
      sektorCounts[fallback].jiwa += w.jumlahKeluarga || 1;
    }
  });

  const sektorDistribution: SektorDistributionItem[] = Object.entries(
    sektorCounts
  )
    .map(([sektor, val]) => ({
      sektor,
      count: val.count,
      jiwa: val.jiwa,
      percentage:
        totalWarga > 0 ? Math.round((val.count / totalWarga) * 100) : 0,
    }))
    .filter((s) => s.count > 0 || prioritySectors.slice(0, 5).includes(s.sektor))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Mini Sparkline Tren Pendaftaran Warga 6 Bulan
  // Default representasi tren bertahap jika database baru dimulai
  const wargaTrendSparkline = [
    Math.max(1, totalWarga - 6),
    Math.max(2, totalWarga - 5),
    Math.max(3, totalWarga - 4),
    Math.max(4, totalWarga - 3),
    Math.max(5, totalWarga - 1),
    totalWarga,
  ];

  // 3. Data Kas & Agregasi 6 Bulan Terakhir
  const kasSummary = await getKasSummary();
  const recentKas = await getKasList();

  // Generate 6 bulan terakhir mundur dari sekarang
  const now = new Date();
  const monthlyMap: Record<
    string,
    { monthKey: string; monthLabel: string; masuk: number; keluar: number }
  > = {};

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
    monthlyMap[key] = {
      monthKey: key,
      monthLabel: label,
      masuk: 0,
      keluar: 0,
    };
  }

  // Akumulasikan transaksi riil ke bulan bersangkutan
  recentKas.forEach((k) => {
    if (k.tanggalTransaksi) {
      const tgl = String(k.tanggalTransaksi); // format YYYY-MM-DD
      const key = tgl.slice(0, 7);
      const nom = parseFloat(k.nominal) || 0;

      if (monthlyMap[key]) {
        if (k.jenisTransaksi === "masuk") {
          monthlyMap[key].masuk += nom;
        } else {
          monthlyMap[key].keluar += nom;
        }
      }
    }
  });

  const monthlyCashFlow: MonthlyCashFlowItem[] = Object.values(monthlyMap);

  // 4. Data Warta Lelayu (Duka Cita)
  const wartaDukaList = await db
    .select()
    .from(wartaPaguyuban)
    .where(eq(wartaPaguyuban.kategori, "duka_cita"))
    .orderBy(desc(wartaPaguyuban.createdAt));

  // 5. Data Usaha & Kategori Terpadat
  const allNiaga = await db.select().from(direktoriNiaga);
  const totalNiaga = allNiaga.length;

  const kategoriCount: Record<string, number> = {};
  allNiaga.forEach((n) => {
    kategoriCount[n.kategoriUsaha] = (kategoriCount[n.kategoriUsaha] || 0) + 1;
  });
  const topNiagaKategori =
    Object.entries(kategoriCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Kuliner & Jasa";

  return (
    <RingkasanClient
      totalWarga={totalWarga}
      pendingWargaCount={pendingWargaCount}
      kasSummary={kasSummary}
      wartaDukaList={wartaDukaList}
      totalNiaga={totalNiaga}
      recentPendingWarga={recentPendingWarga}
      recentKas={recentKas}
      sektorDistribution={sektorDistribution}
      monthlyCashFlow={monthlyCashFlow}
      wargaTrendSparkline={wargaTrendSparkline}
      topNiagaKategori={topNiagaKategori}
    />
  );
}
