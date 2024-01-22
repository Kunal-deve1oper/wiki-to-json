FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./dist .

EXPOSE 5000

CMD [ "node","server.js" ]