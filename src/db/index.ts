import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { Pool } from "pg";

let dbInstance:
  | null
  | (NodePgDatabase<Record<string, never>> & {
      $client: Pool;
    }) = null;

async function initDb() {
  if (dbInstance) return dbInstance;

  let connectionString: string | undefined;

  if (process.env.NODE_ENV === "development" || process.env.APP_DATABASE_URL) {
    console.log("Using local .env connection string");
    connectionString = process.env.APP_DATABASE_URL;
    if (!connectionString) {
      throw new Error("APP_DATABASE_URL missing in your .env.local file!");
    }
  } else {
    console.log("⏳ Fetching secrets from Azure Key Vault...");
    const credential = new DefaultAzureCredential();
    const kvClient = new SecretClient(
      process.env.KEY_VAULT_URL ?? "myurl",
      credential,
    );

    const [dbUrlSecret, nextAuthUrl, nextAuthHashingSecret] = await Promise.all(
      [
        kvClient.getSecret("PG-CONNECTION-STRING"),
        kvClient.getSecret("NEXTAUTH-URL"),
        kvClient.getSecret("NEXTAUTH-SECRET"),
      ],
    );

    connectionString = dbUrlSecret.value;
    process.env.NEXTAUTH_URL = nextAuthUrl.value;
    process.env.NEXTAUTH_SECRET = nextAuthHashingSecret.value;
    console.log("✅ Retrieved all needed secrets.");
  }

  dbInstance = drizzle({ connection: { connectionString } });
  return dbInstance;
}

// ✅ Export a lazy getter — nothing runs until you call getdb()
export async function getdb() {
  return initDb();
}
