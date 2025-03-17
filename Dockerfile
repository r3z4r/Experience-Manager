# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM dev-docker-registry.tecnotree.com/mirror/registry.docker.io/node:20-latest AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Add environment variables for build time
ARG NEXT_PUBLIC_BASE_PATH=/xpm
ARG NEXT_PUBLIC_SITE_URL=https://demo.tecnotree.com
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Add environment variables
ENV DATABASE_URI=mongodb://demomoment:momentPw1d@172.20.21.200:27017/DEMO_MOMENTS?authSource=DEMO_MOMENTS
ENV PAYLOAD_SECRET=5fd2f2f287cf55f22bfb71e3
ENV REACT_EDITOR=code
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51OgPHqSCeWXqwRwV9tXjKxGZvkNwvBQkWXhxJCjVEVqkzuHHNkTe8f1vH8zKdGQjJ9qXZKmqWZq4ZKmqWZq4Z
ENV STRIPE_SECRET_KEY=sk_test_51OgPHqSCeWXqwRwV9tXjKxGZvkNwvBQkWXhxJCjVEVqkzuHHNkTe8f1vH8zKdGQjJ9qXZKmqWZq4ZKmqWZq4Z
ENV ALLOWED_ORIGINS=http://localhost:3000,https://moments-fit.pe-lab14.bdc-rancher.tecnotree.com,https://moments-dev.pe-lab14.bdc-rancher.tecnotree.com,https://pit.tecnotree.com/,demo.tecnotree.com,localhost:5200
ENV RENDER_PATH=/pages

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
