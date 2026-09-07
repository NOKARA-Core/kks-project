import { db, wargaRantau } from "@repo/database";
import { desc } from "drizzle-orm";
import { WargaTable } from "@/components/warga/WargaTable";

export const dynamic = "force-dynamic";

export default async function WargaPage() {
  const listWarga = await db
    .select()
    .from(wargaRantau)
    .orderBy(desc(wargaRantau.createdAt));

  return <WargaTable initialWarga={listWarga} />;
}
