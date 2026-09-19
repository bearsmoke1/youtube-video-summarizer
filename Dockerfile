# Production image: builds the web UI, then serves it from the API on a single port.
# (docker-compose.yml is the two-container development setup; this is the deployable one.)

# 1. build the React app
FROM node:20-alpine AS web
WORKDIR /web
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. API image, with the built UI copied in as static files
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package.json ./
RUN npm install --omit=dev
COPY backend/ ./
COPY --from=web /web/dist ./public
EXPOSE 4000
CMD ["node", "src/server.js"]
