# Use an official Node.js image with Node.js 20
FROM node:20-alpine as build
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]