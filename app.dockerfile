FROM node:10.15-alpine as frontend

WORKDIR /home/node/app/frontend

COPY frontend/package*.json ./
COPY frontend/angular.json ./
COPY frontend/tsconfig.json ./
COPY frontend/src ./src

RUN npm install
RUN npm run build:prod


FROM node:10.15-alpine

WORKDIR /home/node/app

COPY package*.json ./

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install  \
    && apk del build-dependencies


COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY ormconfig.prod.json ./ormconfig.json
COPY src ./src
COPY test ./test

RUN npm run build

COPY --from=frontend /home/node/app/assets ./assets

EXPOSE 3000

CMD ["node", "./dist/src/main.js"]


