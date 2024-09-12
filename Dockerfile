# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Set environment variables
ARG NODE_ENV
ARG CREDS_JSON
ARG ENGAGEMENT_APP_KEY_JSON
ENV NODE_ENV=${NODE_ENV}

# Decode and write secrets if provided
RUN if [ -n "$CREDS_JSON" ]; then echo "$CREDS_JSON" | base64 -d > ./src/creds.json; else echo "{}" > ./src/creds.json; fi && \
    if [ -n "$ENGAGEMENT_APP_KEY_JSON" ]; then echo "$ENGAGEMENT_APP_KEY_JSON" | base64 -d > ./src/engagementAppKey.json; else echo "{}" > ./src/engagementAppKey.json; fi

# Expose the port that Cloud Run will use to serve the application
EXPOSE 8080

# Command to run the application
CMD [ "npm", "start" ]
