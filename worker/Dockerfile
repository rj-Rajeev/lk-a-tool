FROM node:18-alpine

WORKDIR /app

# Copy worker dependencies first (better caching)
COPY worker/package.json worker/package-lock.json ./worker/
COPY worker/tsconfig.json ./worker/

# Install worker deps
WORKDIR /app/worker
RUN npm install

# Copy worker source
COPY worker/ .

# Copy shared web code (NO node_modules)
WORKDIR /app
COPY main ./main

# Run worker
WORKDIR /app/worker
CMD ["npx", "tsx", "index.ts"]
