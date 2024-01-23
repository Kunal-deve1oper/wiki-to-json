FROM ghcr.io/puppeteer/puppeteer:21.5.2

WORKDIR /app

COPY package*.json .

RUN npm install --omit=dev

COPY ./dist ./dist

CMD ["node", "dist/server.js"]