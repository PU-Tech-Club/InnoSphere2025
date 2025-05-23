# Use the official Bun image
FROM oven/bun:1 as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lock ./

# Install dependencies
RUN bun install

# Copy all files
COPY . .

# Build the app
RUN bun run build

# Production stage
FROM oven/bun:1-slim

# Set working directory
WORKDIR /app

# Copy built assets and necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/bun.lock ./

# Install production dependencies only
RUN bun install --production

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"] 