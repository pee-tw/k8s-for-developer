FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN apk -U upgrade

RUN npm ci --only=production --ignore-scripts

COPY dist .
COPY prisma .
RUN npx prisma generate

CMD node main.js