import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Lazily created Drizzle client.
 *
 * `DATABASE_URL` is read on first *use*, never at import time: Next.js executes
 * every route module during `next build` ("collecting page data"), and on hosts
 * like Vercel the connection string only exists at runtime.
 */
function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new DatabaseNotConfiguredError();
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    // Serverless instances are short-lived: keep the per-lambda pool small.
    max: 3,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return drizzle(pool);
}

export type Database = ReturnType<typeof createDb>;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not configured for this environment.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export function isDatabaseNotConfigured(error: unknown) {
  return error instanceof DatabaseNotConfiguredError;
}

const globalForDb = globalThis as typeof globalThis & { __khaanaDb?: Database };

function getDb(): Database {
  if (!globalForDb.__khaanaDb) globalForDb.__khaanaDb = createDb();
  return globalForDb.__khaanaDb;
}

/**
 * Proxy keeps the familiar `import { db } from "@/db"` call sites while deferring
 * pool creation until the first query.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    const real = getDb() as unknown as Record<PropertyKey, unknown>;
    const value = real[property];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(real) : value;
  },
});
