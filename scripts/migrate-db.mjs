import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const { Pool } = pg;
const MIGRATIONS_FOLDER = join(dirname(fileURLToPath(import.meta.url)), "..", "drizzle");
const MIGRATIONS_SCHEMA = "drizzle";
const MIGRATIONS_TABLE = "__drizzle_migrations";
const MIGRATION_LOCK_ID = "7527842219155401001";

function databaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is required to run database migrations.");
  }

  return url;
}

async function migrationCount(client) {
  const result = await client.query(
    "select to_regclass($1) as relation",
    [`${MIGRATIONS_SCHEMA}.${MIGRATIONS_TABLE}`]
  );

  if (!result.rows[0]?.relation) {
    return 0;
  }

  const countResult = await client.query(
    `select count(*)::int as count from ${MIGRATIONS_SCHEMA}.${MIGRATIONS_TABLE}`
  );

  return Number(countResult.rows[0]?.count ?? 0);
}

async function main() {
  const pool = new Pool({
    connectionString: databaseUrl(),
    max: 5
  });
  const lockClient = await pool.connect();
  let lockAcquired = false;

  try {
    console.log("Starting committed database migration application.");
    await lockClient.query("select pg_advisory_lock($1::bigint)", [MIGRATION_LOCK_ID]);
    lockAcquired = true;
    const beforeCount = await migrationCount(lockClient);

    await migrate(drizzle(pool), {
      migrationsFolder: MIGRATIONS_FOLDER,
      migrationsSchema: MIGRATIONS_SCHEMA,
      migrationsTable: MIGRATIONS_TABLE
    });

    const afterCount = await migrationCount(lockClient);
    const appliedCount = afterCount - beforeCount;

    if (appliedCount > 0) {
      console.log(`Applied ${appliedCount} migration record(s).`);
    } else {
      console.log("No pending committed migrations.");
    }

    console.log("Database migration application completed.");
  } finally {
    try {
      if (lockAcquired) {
        await lockClient.query("select pg_advisory_unlock($1::bigint)", [MIGRATION_LOCK_ID]);
      }
    } finally {
      lockClient.release();
      await pool.end();
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Database migration failed.");
  process.exitCode = 1;
});
