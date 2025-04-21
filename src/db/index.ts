import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing in your .env file!");
}

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
});
