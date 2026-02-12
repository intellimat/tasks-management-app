// import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

if (!process.env.APP_DATABASE_URL) {
  throw new Error("APP_DATABASE_URL missing in your .env file!");
}

export const db = drizzle({
  connection: {
    connectionString: process.env.APP_DATABASE_URL,
  },
});
