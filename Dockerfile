FROM ghcr.io/puppeteer/puppeteer:21.7.0 as build

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY ./dist ./dist
# Specify the command to run your application
CMD ["node", "dist/server.js"]
