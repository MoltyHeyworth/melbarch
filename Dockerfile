FROM node:22-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV DATABASE_URL=file:/app/prisma/dev.db
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy
RUN pnpm prisma db seed
RUN pnpm build

# Runtime stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3031
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/prisma/dev.db

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db

EXPOSE 3031
CMD ["node", "server.js"]
