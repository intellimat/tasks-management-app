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

  let connectionString;

  // LOCAL: Use .env.local
  if (process.env.NODE_ENV === "development" || process.env.APP_DATABASE_URL) {
    console.log("Using local .env connection string");
    connectionString = process.env.APP_DATABASE_URL;

    if (!connectionString) {
      throw new Error("APP_DATABASE_URL missing in your .env.local file!");
    }
  }
  // PRODUCTION: Use AzureKey Vault
  else {
    console.log("⏳ Fetching secrets from Azure key vault. ");
    const credential = new DefaultAzureCredential();
    const kvClient = new SecretClient(
      process.env.KEY_VAULT_URL ||
        "https://tasks-app-key-vault.vault.azure.net/",
      credential,
    );
    const dbUrlSecret = await kvClient.getSecret("PG-CONNECTION-STRING");
    connectionString = dbUrlSecret.value;

    // Map env variables needed for authentication and hashing (url, hasing key)
    const nextAuthUrl = await kvClient.getSecret("NEXTAUTH-URL");
    process.env.NEXTAUTH_URL = nextAuthUrl.value;
    const nextAuthHasingSecret = await kvClient.getSecret("NEXTAUTH-SECRET");
    process.env.NEXTAUTH_SECRET = nextAuthHasingSecret.value;

    console.log("✅ Retrieved all needed secrets.");
  }

  dbInstance = drizzle({
    connection: {
      connectionString,
    },
  });

  return dbInstance;
}

export const db = await initDb();
