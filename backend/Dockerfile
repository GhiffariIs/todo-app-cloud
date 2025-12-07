# Stage 1: Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create directory for database
RUN mkdir -p /app/data

# Cloud Run akan set PORT via environment variable
# Default 8080 untuk compatibility
ENV PORT=8080
ENV DB_PATH=/app/data

# Expose port
EXPOSE 8080

# Health check - gunakan PORT dari env
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 8080; require('http').get('http://localhost:' + port + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]