import { db, wargaRantau, wartaPaguyuban, kasSosial, direktoriNiaga } from "@repo/database";
import { eq, desc } from "drizzle-orm";
import { getKasSummary, getKasList } from "@/app/actions/kas";
import { RingkasanClient } from "@/components/dashboard/RingkasanClient";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  // 1. Data Warga
  const allWarga = await db.select().from(wargaRantau);
  const totalWarga = allWarga.length;
  const pendingWarga = allWarga.filter((w) => w.statusVerifikasi === "pending");
  const pendingWargaCount = pendingWarga.length;
  const recentPendingWarga = pendingWarga.slice(0, 5);

  // 2. Data Kas
  const kasSummary = await getKasSummary();
  const recentKas = await getKasList();

  // 3. Data Warta Lelayu (Duka Cita)
  const wartaDukaList = await db
    .select()
    .from(wartaPaguyuban)
    .where(eq(wartaPaguyuban.kategori, "duka_cita"))
    .orderBy(desc(wartaPaguyuban.createdAt));

  // 4. Data Usaha
  const allNiaga = await db.select().from(direktoriNiaga);
  const totalNiaga = allNiaga.length;

  return (
    <RingkasanClient
      totalWarga={totalWarga}
      pendingWargaCount={pendingWargaCount}
      kasSummary={kasSummary}
      wartaDukaList={wartaDukaList}
      totalNiaga={totalNiaga}
      recentPendingWarga={recentPendingWarga}
      recentKas={recentKas}
    />
  );
}
