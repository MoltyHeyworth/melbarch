# MelbArch -- Melbourne Architectural Houses

A private personal database of architecturally significant houses in Melbourne, Australia.

## What it is
Browse, filter, and research architecturally notable Melbourne houses. Add notes, track status (Interested/Contacted/Passed), and build a private research database for finding exceptional homes not on the market.

## Quick start
```
pnpm install
cp .env.example .env.local  # set DATABASE_URL and ADMIN_PASSWORD
pnpm dev  # starts on port 3030
```

## Data entry
- Use the N shortcut to quickly add a house
- Import a batch via CSV at /import
- Export all data as JSON via /api/export

## Tech
Next.js 16, TypeScript, Tailwind, Prisma, SQLite
