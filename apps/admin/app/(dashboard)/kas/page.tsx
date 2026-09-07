import { getKasList, getKasSummary } from "@/app/actions/kas";
import { KasManager } from "@/components/kas/KasManager";

export const dynamic = "force-dynamic";

export default async function KasPage() {
  const [kasList, summary] = await Promise.all([
    getKasList(),
    getKasSummary(),
  ]);

  return <KasManager initialKas={kasList} initialSummary={summary} />;
}
