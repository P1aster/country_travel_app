# Development stage with hot reload
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy monorepo files from root
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Copy application code
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

# Expose the port the app runs on
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Run in development mode with watch
CMD ["pnpm", "run", "dev"]
