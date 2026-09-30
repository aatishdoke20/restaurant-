import { db, isDatabaseNotConfigured } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { enquiries } from "@/db/schema";
import { isEmail, isISODate } from "@/content/reservations";

export const dynamic = "force-dynamic";

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const json: unknown = await request.json();
    if (!json || typeof json !== "object") throw new Error("Invalid body");
    body = json as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = text(body.name);
  const email = text(body.email);
  const phone = text(body.phone);
  const eventDate = text(body.eventDate);
  const space = text(body.space);
  const occasion = text(body.occasion);
  const message = text(body.message);
  const guests = Number(body.guests);

  const fields: Record<string, string> = {};
  if (name.length < 2 || name.length > 120) fields.name = "Please tell us your name.";
  if (!isEmail(email)) fields.email = "Please enter a valid email address.";
  if (!Number.isInteger(guests) || guests < 2 || guests > 200) fields.guests = "Please enter between 2 and 200 guests.";
  if (eventDate && !isISODate(eventDate)) fields.eventDate = "Please choose a valid date.";
  if (message.length > 1000) fields.message = "Please keep your message under 1000 characters.";
  if (Object.keys(fields).length) {
    return Response.json({ error: "Please check the highlighted details.", fields }, { status: 400 });
  }

  try {
    await ensureSchema();
    await db.insert(enquiries).values({
      name,
      email,
      phone: phone || null,
      eventDate: eventDate || null,
      guests,
      space: space.slice(0, 80) || null,
      occasion: occasion.slice(0, 60) || null,
      message: message || null,
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (isDatabaseNotConfigured(error)) {
      console.warn("[enquiries] DATABASE_URL is not configured — rejecting enquiry");
      return Response.json(
        { error: "Online enquiries are unavailable right now. Please call us on +91 20 4000 1234." },
        { status: 503 },
      );
    }
    console.error("[enquiries] failed to store enquiry", error);
    return Response.json({ error: "We couldn't send your enquiry right now." }, { status: 500 });
  }
}
