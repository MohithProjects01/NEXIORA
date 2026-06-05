# CollegeCompass AI

CollegeCompass AI is a production-ready MVP for college discovery, comparison, reviews, saved colleges, and admission prediction. It is built as a full-stack Next.js application with Prisma, PostgreSQL, NextAuth, TanStack Query, React Hook Form, Zod, and Shadcn-style UI primitives.

## Tech Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 with reusable UI components
- Next.js Route Handlers for backend APIs
- PostgreSQL with Prisma ORM 7
- NextAuth.js JWT sessions with credentials auth
- React Hook Form and Zod validation
- TanStack Query for client-side fetching, caching, and mutations
- Vercel and Neon PostgreSQL deployment readiness

## Features

- College discovery with search, filters, sorting, and server-side pagination
- College detail pages with overview, courses, placements, recruiters, and reviews
- Authenticated review create, edit, and delete flows
- Compare up to 3 colleges and save comparisons
- Admission predictor for JEE Main, KCET, and COMEDK with persisted history
- Save and remove colleges from a protected dashboard
- Profile dashboard with user activity summaries
- Seed data for Indian colleges, courses, reviews, saved colleges, comparisons, and predictions

## Project Structure

```txt
src/app/              App Router pages, layouts, proxy, and API route handlers
src/components/       Reusable layout, shared, UI, college, compare, predictor, and review components
src/features/         Feature-level client flows and React context
src/hooks/            Client hooks
src/lib/              Auth, Prisma, validation, HTTP, sanitization, and utilities
src/services/         Server-side data access and business logic
src/types/            Shared TypeScript DTOs and NextAuth augmentation
prisma/               Prisma schema and seed script
prisma.config.ts      Prisma 7 datasource, schema, and seed configuration
```

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
DATABASE_URL="postgresql://user:password@host:5432/collegecompass?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-strong-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="CollegeCompass AI"
```

Prisma 7 reads `DATABASE_URL` from `prisma.config.ts`; do not put `url = env("DATABASE_URL")` back into `schema.prisma`.

## Local Development

```bash
npm.cmd install
npm.cmd run db:generate
npm.cmd run db:push
npm.cmd run db:seed
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo seeded password:

```txt
CollegeCompass@123
```

## Verification

```bash
npm.cmd run db:generate
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

The project avoids external build-time font fetching so production builds work in restricted CI and Vercel environments.

## API Routes

- `GET /api/colleges` with search, filters, sorting, and pagination
- `GET /api/colleges/[id]`
- `POST /api/colleges`, `PUT /api/colleges/[id]`, `DELETE /api/colleges/[id]`
- `POST /api/reviews`, `GET /api/reviews?collegeId=...`
- `PUT /api/reviews/[id]`, `DELETE /api/reviews/[id]`
- `POST /api/compare`, `GET /api/compare`
- `POST /api/predictor`, `GET /api/predictor/history`
- `POST /api/saved`, `DELETE /api/saved`, `GET /api/saved`
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`

## Admin

- Admin college management lives at `/admin/colleges`
- Only emails listed in `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS` can access it
- Seeded demo admin: `demo@collegecompass.ai` / `CollegeCompass@123`

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Create a Neon PostgreSQL database and copy the connection string.
4. Add these environment variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_APP_NAME`
   - `ADMIN_EMAILS`
   - `NEXT_PUBLIC_ADMIN_EMAILS`
5. Deploy. `vercel.json` runs `prisma generate` before the production build.
6. After the first deploy, run schema sync and seed from a trusted environment:

```bash
npm.cmd run db:generate
npm.cmd run db:push
npm.cmd run db:seed
```

For production, replace the development `NEXTAUTH_SECRET`, use Neon SSL, and restrict database credentials to the deployed app.
