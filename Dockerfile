
FROM node:16


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm rebuild sqlite3

ENV PORT=3000


EXPOSE 3000

CMD ["npx", "ts-node", "src/infrastructure/server.ts"]


