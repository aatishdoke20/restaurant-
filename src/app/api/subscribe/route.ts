import { db, isDatabaseNotConfigured } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { subscribers } from "@/db/schema";
import { isEmail } from "@/content/reservations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let email = "";
  try {
    const json: unknown = await request.json();
    if (json && typeof json === "object" && "email" in json && typeof json.email === "string") {
      email = json.email.trim().toLowerCase();
    }
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isEmail(email) || email.length > 200) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await ensureSchema();
    await db.insert(subscribers).values({ email }).onConflictDoNothing({ target: subscribers.email });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (isDatabaseNotConfigured(error)) {
      console.warn("[subscribe] DATABASE_URL is not configured — rejecting subscription");
      return Response.json({ error: "Signups are unavailable right now." }, { status: 503 });
    }
    console.error("[subscribe] failed", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
