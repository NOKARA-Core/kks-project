import { db, direktoriNiaga } from "@repo/database";
import { desc } from "drizzle-orm";
import { NiagaManager } from "@/components/niaga/NiagaManager";

export const dynamic = "force-dynamic";

export default async function NiagaPage() {
  const listNiaga = await db
    .select()
    .from(direktoriNiaga)
    .orderBy(desc(direktoriNiaga.createdAt));

  return <NiagaManager initialNiaga={listNiaga} />;
}
