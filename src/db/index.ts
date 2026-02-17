import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let dbInstance:
  | null
  | (NodePgDatabase<Record<string, never>> & {
      $client: Pool;
    }) = null;

async function initDb() {
  if (dbInstance) return dbInstance;

  const connectionString = process.env.APP_DATABASE_URL;
  if (!connectionString) {
    throw new Error("APP_DATABASE_URL is missing in your environment!");
  }

  dbInstance = drizzle({ connection: { connectionString } });
  return dbInstance;
}

// ✅ Export a lazy getter — nothing runs until you call getdb()
export async function getdb() {
  return initDb();
}
