<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## CollegeCompass AI project notes

- The installed runtime is Next.js 16.x with the App Router. Use `src/proxy.ts` for request-time auth redirects; do not add new `middleware.ts` files.
- Prisma is 7.x. Keep `DATABASE_URL` in `prisma.config.ts`, not in `schema.prisma`, and instantiate `PrismaClient` with the Postgres driver adapter in `src/lib/prisma.ts`.
- Preserve the production MVP stack: React 19, TypeScript, Tailwind CSS, Shadcn-style components, NextAuth JWT sessions, TanStack Query, Prisma, and PostgreSQL/Neon readiness.
- Before handing off code changes, run `npm.cmd run db:generate`, `npm.cmd run typecheck`, `npm.cmd run lint`, and preferably `npm.cmd run build` on Windows PowerShell.
