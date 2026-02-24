import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const myEnv = dotenv.config({ path: ".env" }); // can be []
dotenvExpand.expand(myEnv);

const runMigrations = async () => {
  const pool = new Pool({
    connectionString: process.env.MIGRATIONS_DATABASE_URL,
    max: 1, // Single connection for migrations
  });

  try {
    const db = drizzle(pool);

    console.log("⏳ Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

runMigrations()
  .then(() => {
    console.log("Migration process finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration process failed:", err);
    process.exit(1);
  });
