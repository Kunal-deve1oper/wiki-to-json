FROM ghcr.io/puppeteer/puppeteer:21.5.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package*.json ./

RUN npm ci 

RUN mkdir -p /app/files

COPY dist/ ./dist/

EXPOSE 5000

CMD ["node", "dist/server.js"]