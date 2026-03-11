# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production=false

# Copy rest of backend files
COPY backend ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Copy frontend files
WORKDIR /app
COPY code/package*.json ./code/
WORKDIR /app/code
RUN npm install

# Copy and build frontend
COPY code ./
RUN npm run build

# Go back to backend for serving
WORKDIR /app/backend

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start command
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
