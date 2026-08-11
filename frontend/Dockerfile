FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173
# P0/dev: run the Vite dev server. P6 may switch to a production build + preview.
CMD ["npm", "run", "dev"]
