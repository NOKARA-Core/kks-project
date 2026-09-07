import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "path";

// Coba muat .env dari apps/admin atau folder lokal
dotenv.config({ path: path.resolve(__dirname, "../../apps/admin/.env") });
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:root@127.0.0.1:5432/kks_platform_db";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
