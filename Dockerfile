FROM ghcr.io/puppeteer/puppeteer:21.7.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./dist ./dist

CMD ["node", "dist/server.js"]
