# Khaana — Contemporary Indian Cuisine

Luxury editorial single-page site for a fictional contemporary Indian restaurant in Pune.
Next.js (App Router) · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Drizzle ORM + PostgreSQL.

## Run locally

```bash
npm install
cp .env.example .env      # set your DATABASE_URL
npm run dev
```

Reservations, private-dining enquiries and newsletter signups are stored in PostgreSQL.
Tables (`reservations`, `enquiries`, `subscribers`) are created automatically on the first
API request, or push `src/db/schema.ts` manually with `npx drizzle-kit push`.

## Deploy on Vercel

1. Push this repository to GitHub and import it into Vercel (framework preset: Next.js).
2. Create a Postgres database (Vercel Postgres / Neon) and copy its **pooled** connection string.
3. In the Vercel project, add an environment variable:
   - `DATABASE_URL` = `postgresql://…?sslmode=require`
4. Deploy. The build itself needs no database; the connection is only opened when an API
   route runs. If `DATABASE_URL` is missing at runtime the API replies with `503` and the
   forms show the restaurant's phone number instead of failing silently.

Make sure `public/images` and `public/textures` are committed — the site's photography and
film-grain texture live there.

## Content

All copy, menu data, ingredient lists and image references are in `src/content/site.ts`.
Reservation rules (seating times, capacities, validation) are in `src/content/reservations.ts`
and are shared by the client form and the API routes.
