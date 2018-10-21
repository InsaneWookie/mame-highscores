FROM node:10.12.0-alpine

WORKDIR /home/node/app

COPY package*.json .

RUN npm install --only=production

COPY . .

#ENV NODE_ENV production

EXPOSE 1337

CMD [ "node", "app.js" ]


