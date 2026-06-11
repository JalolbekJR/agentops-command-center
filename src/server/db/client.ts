import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export function createDatabaseConnection(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database commands.");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5
  });

  return {
    db: drizzle(pool, { schema }),
    pool
  };
}

export type DatabaseConnection = ReturnType<typeof createDatabaseConnection>;
