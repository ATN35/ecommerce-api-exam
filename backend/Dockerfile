FROM node:20-alpine

WORKDIR /app

# Install system deps
RUN apk add --no-cache bash

# Copy package manifests
COPY package.json /app/package.json
COPY backend/package.json /app/backend/package.json

# Install dependencies
RUN cd /app && npm install --include=dev && cd backend && npm install --include=dev

# Copy source
COPY . /app

ENV NODE_ENV=production
CMD ["node", "backend/src/server.js"]
