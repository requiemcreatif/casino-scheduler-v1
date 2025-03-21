# I had some issues with the Dockerfile, so I decided to use the one from the Next.js documentation
# https://nextjs.org/docs/app/building-your-application/deploying#docker-image

FROM node:18-alpine AS base

# Install additional tools
RUN apk add --no-cache libc6-compat bash

# Install dependencies when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./

# Try to use package-lock.json first, fall back to yarn if needed
RUN if [ -f "package-lock.json" ]; then \
      npm ci --legacy-peer-deps || npm install --legacy-peer-deps; \
    elif [ -f "yarn.lock" ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Rebuild the source code when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Rename Babel config temporarily to avoid conflicts with Next.js font loader
RUN if [ -f ".babelrc.js" ]; then mv .babelrc.js .babelrc.js.bak; fi

# To make sure Next.js knows to build in standalone mode
# This will be merged with any existing next.config.js
RUN echo "module.exports = { ...require('./next.config.js'), output: 'standalone' };" > next.config.docker.js
RUN mv next.config.docker.js next.config.js

RUN npm run build || (echo "Build failed, trying with additional flags" && npm run build --legacy-peer-deps)

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set up permissions for Next.js directory
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Copy either standalone mode or regular .next folder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Add health check script
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN echo '#!/bin/sh\nwget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1' > /app/healthcheck.sh
RUN chmod +x /app/healthcheck.sh

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s CMD ["/app/healthcheck.sh"]

# Use next start instead of node server.js
CMD ["npm", "run", "start"]