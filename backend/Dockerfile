# Multi-Stage Production Dockerfile for SlotMyInterview Backend
# Stage 1: Build & Compile
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci

COPY src ./src

# Generate Prisma Client & compile TypeScript
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force
RUN npx prisma generate

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory with non-root permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

USER node

EXPOSE 5000

# Default command: HTTP API server
CMD ["node", "dist/server.js"]

