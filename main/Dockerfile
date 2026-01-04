FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY main/package.json main/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY main/ .

# Build Next.js
RUN npm run build

# Run in production mode
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
