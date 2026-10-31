This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Setup (Supabase + Prisma + Cal.com)

1. `cp .env.example .env.local` and fill in: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `DATABASE_URL` (pooled), `DIRECT_URL` (direct), `NEXT_PUBLIC_SITE_URL`, optional `RESEND_API_KEY`.
2. `npm install` (runs `prisma generate`), then create the schema:
   - New database: `npx prisma migrate dev --name init`
   - Existing database: `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`, `npx prisma migrate resolve --applied 0_init`, then apply the new tables/columns (`CalBooking`, `Lead`, video and Cal.com fields on `SeekerProfile`) with `npx prisma db push`.
3. Run `supabase/policies.sql` in the Supabase SQL editor (idempotent). It enables RLS, column-level grants and the `pitch-videos` storage policies.
4. Supabase Auth: add `<SITE_URL>/auth/callback` to the redirect URLs.
5. Cal.com: candidates paste their Cal.com link in the dashboard, which also shows a personal webhook URL and secret. Add it in Cal.com under Webhooks (events: created, rescheduled, cancelled).
6. `npm run db:seed` only works with `SEED_CONFIRM_WIPE=yes` and refuses to run in production. Seeded users have no password and link on confirmed sign-up.

The old Express service in `backend/` is no longer used.
