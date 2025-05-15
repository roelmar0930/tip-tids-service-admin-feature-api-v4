# Build stage
FROM node:18-slim AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production

# Copy application source
COPY . .

# Security scanning stage
FROM aquasec/trivy:latest AS security-scan
COPY --from=builder /usr/src/app /app
RUN trivy filesystem --no-progress --exit-code 1 --severity HIGH,CRITICAL /app

# Production stage
FROM node:18-slim

# Install dumb-init and curl for proper signal handling and health checks
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init curl && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app ./

# Set environment variables
ARG NODE_ENV
ARG CREDS_JSON
ARG ENGAGEMENT_APP_KEY_JSON
ENV NODE_ENV=${NODE_ENV} \
    PORT=8080 \
    NODE_OPTIONS="--max-old-space-size=2048" \
    NPM_CONFIG_LOGLEVEL="warn"

# Decode and write secrets if provided
RUN if [ -n "$CREDS_JSON" ]; then \
      echo "$CREDS_JSON" | base64 -d > ./src/creds.json; \
    else \
      echo "{}" > ./src/creds.json; \
    fi && \
    if [ -n "$ENGAGEMENT_APP_KEY_JSON" ]; then \
      echo "$ENGAGEMENT_APP_KEY_JSON" | base64 -d > ./src/engagementAppKey.json; \
    else \
      echo "{}" > ./src/engagementAppKey.json; \
    fi && \
    chown nodejs:nodejs ./src/creds.json ./src/engagementAppKey.json && \
    chmod 400 ./src/creds.json ./src/engagementAppKey.json

# Security hardening
RUN npm audit fix && \
    chmod -R 500 /usr/src/app && \
    chmod -R 400 /usr/src/app/node_modules && \
    chmod 500 /usr/src/app/node_modules/.bin/*

# Switch to non-root user
USER nodejs

# Expose the port that Cloud Run will use
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/status || exit 1

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Command to run the application
CMD [ "npm", "start" ]
