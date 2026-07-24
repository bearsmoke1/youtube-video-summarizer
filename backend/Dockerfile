FROM node:20-alpine

WORKDIR /app

# install deps first (better layer caching)
COPY package.json ./
RUN npm install

# app source
COPY . .

EXPOSE 4000
CMD ["node", "src/server.js"]
