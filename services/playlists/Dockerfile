FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

# Script pour lancer à la fois le serveur et le worker
CMD ["sh", "-c", "node server.js & node worker.js"]
