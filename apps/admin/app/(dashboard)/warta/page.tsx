import { db, wartaPaguyuban } from "@repo/database";
import { desc } from "drizzle-orm";
import { WartaManager } from "@/components/warta/WartaManager";

export const dynamic = "force-dynamic";

export default async function WartaPage() {
  const listWarta = await db
    .select()
    .from(wartaPaguyuban)
    .orderBy(desc(wartaPaguyuban.createdAt));

  return <WartaManager initialWarta={listWarta} />;
}
