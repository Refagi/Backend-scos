FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy semua source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

EXPOSE 3000

# Migrate DB lalu jalankan server
CMD bunx prisma migrate deploy && bun run src/index.ts
