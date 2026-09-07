import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import * as path from "path";

// Auto-load .env jika belum terisi di process.env
if (!process.env.DATABASE_URL) {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
    dotenv.config({ path: path.resolve(process.cwd(), "apps/admin/.env") });
    dotenv.config({ path: path.resolve(__dirname, "../../apps/admin/.env") });
  } catch {
    // Abaikan jika tidak ditemukan file
  }
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:root@127.0.0.1:5432/kks_platform_db";

// Global singleton cache untuk mencegah connection leak pada Next.js Fast Refresh
declare global {
  // eslint-disable-next-line no-var
  var __kks_postgres_client: postgres.Sql | undefined;
}

const client =
  globalThis.__kks_postgres_client ||
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // Aman untuk connection pooler (mis. Supabase transaction mode PgBouncer)
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__kks_postgres_client = client;
}

export const db = drizzle(client, { schema });
export { client };
