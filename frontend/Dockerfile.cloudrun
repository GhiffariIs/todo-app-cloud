# frontend/Dockerfile.cloudrun
# Multi-stage build for production

# Stage 1: Build React app
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.cloudrun.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Cloud Run uses PORT env variable
# Create entrypoint script to use dynamic port
RUN echo $'#!/bin/sh\n\
PORT=${PORT:-8080}\n\
sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

EXPOSE 8080

# Start nginx with dynamic port
ENTRYPOINT ["/docker-entrypoint.sh"]