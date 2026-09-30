import { and, eq, sql } from "drizzle-orm";
import { db, isDatabaseNotConfigured } from "@/db";
import { ensureSchema } from "@/db/ensure";
import { reservations } from "@/db/schema";
import {
  EXPERIENCES,
  isEmail,
  isISODate,
  isPhone,
  isValidSlot,
  MAX_ONLINE_GUESTS,
  OCCASIONS,
  RESERVATION_WINDOW_DAYS,
  SEATING_CAPACITY,
  toMinutes,
} from "@/content/reservations";

export const dynamic = "force-dynamic";

/** Current date and minutes-of-day at the restaurant (Pune, IST). */
function nowInIndia() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

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

  const date = text(body.date);
  const time = text(body.time);
  const name = text(body.name);
  const email = text(body.email);
  const phone = text(body.phone);
  const notes = text(body.notes);
  const occasionInput = text(body.occasion);
  const experienceInput = text(body.experience);
  const guests = Number(body.guests);

  const fields: Record<string, string> = {};
  const india = nowInIndia();

  if (!isISODate(date)) fields.date = "Please choose a valid date.";
  else if (date < india.date) fields.date = "Please choose a future date.";
  else if (date > addDaysISO(india.date, RESERVATION_WINDOW_DAYS)) fields.date = "We take bookings up to 90 days ahead.";

  if (!isValidSlot(time)) fields.time = "Please choose an available time.";
  else if (date === india.date && toMinutes(time) < india.minutes + 60) fields.time = "Please choose a later seating for today.";

  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_ONLINE_GUESTS) {
    fields.guests = `Online reservations are for 1–${MAX_ONLINE_GUESTS} guests.`;
  }
  if (name.length < 2 || name.length > 120) fields.name = "Please tell us your name.";
  if (!isEmail(email) || email.length > 200) fields.email = "Please enter a valid email address.";
  if (!isPhone(phone)) fields.phone = "Please enter a valid phone number.";
  if (notes.length > 500) fields.notes = "Please keep notes under 500 characters.";

  if (Object.keys(fields).length) {
    return Response.json({ error: "Please check the highlighted details.", fields }, { status: 400 });
  }

  const occasion = (OCCASIONS as readonly string[]).includes(occasionInput) ? occasionInput : null;
  const experience = (EXPERIENCES as readonly string[]).includes(experienceInput) ? experienceInput : EXPERIENCES[0];

  try {
    await ensureSchema();

    const [booked] = await db
      .select({ total: sql<string>`coalesce(sum(${reservations.guests}), 0)` })
      .from(reservations)
      .where(and(eq(reservations.date, date), eq(reservations.time, time), eq(reservations.status, "confirmed")));

    if (Number(booked?.total ?? 0) + guests > SEATING_CAPACITY) {
      return Response.json(
        {
          error: "That seating is fully booked. Please choose another time.",
          fields: { time: "Fully booked — please try another time." },
        },
        { status: 409 },
      );
    }

    const reference = `KH-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
    await db.insert(reservations).values({
      reference,
      date,
      time,
      guests,
      name,
      email,
      phone,
      occasion,
      experience,
      notes: notes || null,
    });

    return Response.json({ reference, date, time, guests }, { status: 201 });
  } catch (error) {
    if (isDatabaseNotConfigured(error)) {
      console.warn("[reservations] DATABASE_URL is not configured — rejecting booking");
      return Response.json(
        { error: "Online reservations are unavailable right now. Please call us on +91 20 4000 1234." },
        { status: 503 },
      );
    }
    console.error("[reservations] failed to create reservation", error);
    return Response.json(
      { error: "We couldn't confirm your table right now. Please call us on +91 20 4000 1234." },
      { status: 500 },
    );
  }
}
