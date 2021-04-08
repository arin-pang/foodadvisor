ARG NODE_IMAGE=node:erbium-alpine

FROM $NODE_IMAGE

WORKDIR /usr/src/git-controller

COPY . .

RUN npm install -g ts-node typescript

RUN npm ci

EXPOSE 13000