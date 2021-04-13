ARG NODE_IMAGE=node:erbium-alpine

FROM $NODE_IMAGE

WORKDIR /usr/src/food-advisor-api-only

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

RUN yarn seed

EXPOSE 1337