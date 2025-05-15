# Build stage
FROM node:16-slim AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Production stage
FROM node:16-slim

# Install dumb-init and curl for proper signal handling and health checks
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init curl && rm -rf /var/lib/apt/lists/*

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
    PORT=8080

# Decode and write secrets if provided
RUN if [ -n "$CREDS_JSON" ]; then echo "$CREDS_JSON" | base64 -d > ./src/creds.json; else echo "{}" > ./src/creds.json; fi && \
    if [ -n "$ENGAGEMENT_APP_KEY_JSON" ]; then echo "$ENGAGEMENT_APP_KEY_JSON" | base64 -d > ./src/engagementAppKey.json; else echo "{}" > ./src/engagementAppKey.json; fi && \
    chown nodejs:nodejs ./src/creds.json ./src/engagementAppKey.json

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
