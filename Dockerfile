
FROM node:22-bookworm-slim

WORKDIR /app

# Install tools in case a native Node.js dependency needs compiling
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# Keep the SQLite database outside the publicly served website directory
RUN mkdir -p /var/lib/noire \
    && chown -R node:node /var/lib/noire \
    && chown -R node:node /app

ENV NODE_ENV=production
ENV DB_PATH=/var/lib/noire/enquiries.db

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"


USER node

CMD ["node", "server.js"]
