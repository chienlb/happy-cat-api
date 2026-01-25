# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# build-base cho bcrypt (native module)
RUN apk add --no-cache --virtual .build-deps build-base python3 && \
    pnpm install --frozen-lockfile && \
    apk del .build-deps

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy từ build (node_modules đã có bcrypt build sẵn), chỉ giữ prod deps
COPY package.json pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN pnpm prune --prod

# Chạy với user không phải root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs && \
    chown -R nestjs:nodejs /app
USER nestjs

ENV NODE_ENV=production
EXPOSE 3000

# Healthcheck (tùy chọn - cần endpoint /health hoặc /api/health)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget -q -O- http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/main.js"]

# Chạy: cần truyền biến môi trường (file .env không được copy vào image)
#   docker run --env-file .env -p 3000:3000 spnc-api
# Hoặc: docker compose up
