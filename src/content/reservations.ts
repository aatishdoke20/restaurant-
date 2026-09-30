/** Shared reservation rules — imported by both the client form and the API route. */

export type Service = "lunch" | "dinner";
export type TimeSlot = { value: string; label: string; service: Service };

export const MAX_ONLINE_GUESTS = 12;
export const RESERVATION_WINDOW_DAYS = 90;
/** Covers available per seating. */
export const SEATING_CAPACITY = 36;

export const EXPERIENCES = ["À la carte", "Chef's Table", "Seasonal Tasting", "Private Dining"] as const;
export const OCCASIONS = ["Birthday", "Anniversary", "Business", "Celebration", "Other"] as const;

const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad2(m)} ${suffix}`;
}

function buildSlots(startHour: number, endHour: number, service: Service): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += 30) {
    const value = `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;
    slots.push({ value, label: formatTime(value), service });
  }
  return slots;
}

export const TIME_SLOTS: TimeSlot[] = [...buildSlots(12, 14.5, "lunch"), ...buildSlots(18, 22, "dinner")];

export function toMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function isValidSlot(value: string) {
  return TIME_SLOTS.some((slot) => slot.value === value);
}

/* ---------- Dates (ISO yyyy-mm-dd, local time) ---------- */

export function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function fromISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const isISODate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(fromISO(value).getTime());

export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatShortDate(iso: string) {
  const d = fromISO(iso);
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatLongDate(iso: string) {
  const d = fromISO(iso);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---------- Contact validation ---------- */

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export function isPhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return /^\+?[\d\s()-]+$/.test(trimmed) && digits.length >= 10 && digits.length <= 13;
}
