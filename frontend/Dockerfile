FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173
# Runs the Vite dev server; swap for a production build + preview if deploying.
CMD ["npm", "run", "dev"]
