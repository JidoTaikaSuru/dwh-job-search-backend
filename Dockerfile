# Phase 1: Build
FROM node:21-alpine as build

WORKDIR /usr/src/app
RUN apk add --update --no-cache python3 make g++ git

COPY package*.json ./
RUN npm install -g pnpm

RUN pnpm install

COPY . .
RUN pnpm run build

# Phase 2: Run
FROM node:21-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
EXPOSE 8080

CMD [ "pnpm", "start" ]
#CMD tail -f /dev/null