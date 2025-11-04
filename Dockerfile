# -----------------------------
# 1️⃣ Base Image (for build)
# -----------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies (system-level)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy only package files first for caching
COPY package*.json yarn.lock* pnpm-lock.yaml* ./

# Install dependencies efficiently
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    else npm install; fi

# Copy app code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# -----------------------------
# 2️⃣ Runner Image
# -----------------------------
FROM node:20-slim AS runner

WORKDIR /app

# Security: remove cache & add only necessary packages
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy required files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
