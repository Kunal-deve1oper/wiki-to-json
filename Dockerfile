FROM ghcr.io/puppeteer/puppeteer:21.5.2 as development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM ghcr.io/puppeteer/puppeteer:21.5.2 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/server.js"]