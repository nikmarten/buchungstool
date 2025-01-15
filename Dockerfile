# Build stage for Client
FROM node:18 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for Server
FROM node:18 AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Production stage
FROM node:18-slim
WORKDIR /app
COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/build ./client/build

# Install only production dependencies for server
WORKDIR /app/server
RUN npm install --only=production

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "index.js"] 