FROM node:18-alpine AS base

# Install dependencies when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps

# Rebuild the source code when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Rename Babel config temporarily to avoid conflicts with Next.js font loader
RUN if [ -f ".babelrc.js" ]; then mv .babelrc.js .babelrc.js.bak; fi

# Make sure Next.js knows to build in standalone mode
# This will be merged with any existing next.config.js
RUN echo "module.exports = { ...require('./next.config.js'), output: 'standalone' };" > next.config.docker.js
RUN mv next.config.docker.js next.config.js

RUN npm run build

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

# Use a conditional approach for copying .next files
# Either copy standalone mode or regular .next folder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy the startup script
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use next start instead of node server.js
CMD ["npm", "run", "start"]