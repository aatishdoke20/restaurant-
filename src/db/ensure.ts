import { sql } from "drizzle-orm";
import { db } from "@/db";

let ready: Promise<void> | null = null;

/**
 * Idempotently creates the tables used by the API routes (mirrors `schema.ts`,
 * including Drizzle's constraint names) so fresh environments work even before
 * `drizzle-kit push` has been run.
 */
export function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "reservations" (
          "id" serial PRIMARY KEY NOT NULL,
          "reference" varchar(16) NOT NULL,
          "date" date NOT NULL,
          "time" varchar(5) NOT NULL,
          "guests" integer NOT NULL,
          "name" text NOT NULL,
          "email" text NOT NULL,
          "phone" text NOT NULL,
          "occasion" text,
          "experience" text,
          "notes" text,
          "status" varchar(16) DEFAULT 'confirmed' NOT NULL,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          CONSTRAINT "reservations_reference_unique" UNIQUE("reference")
        )
      `);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "enquiries" (
          "id" serial PRIMARY KEY NOT NULL,
          "name" text NOT NULL,
          "email" text NOT NULL,
          "phone" text,
          "event_date" date,
          "guests" integer NOT NULL,
          "space" text,
          "occasion" text,
          "message" text,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL
        )
      `);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "subscribers" (
          "id" serial PRIMARY KEY NOT NULL,
          "email" text NOT NULL,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          CONSTRAINT "subscribers_email_unique" UNIQUE("email")
        )
      `);
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}
