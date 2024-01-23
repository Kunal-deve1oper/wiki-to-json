FROM ghcr.io/puppeteer/puppeteer:21.5.2 as development

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@10.3.0

RUN npm install

COPY . .

RUN npm run build

FROM ghcr.io/puppeteer/puppeteer:21.5.2 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@10.3.0

RUN npm install --omit=dev

COPY --from=development /app/dist ./dist

CMD ["node", "dist/server.js"]