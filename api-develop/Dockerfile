ARG NODE_IMAGE=node:erbium-alpine

FROM $NODE_IMAGE

RUN apk add git

WORKDIR /usr/src/food-advisor

RUN git checkout https://github.com/arin-pang/foodadvisor.git

COPY ./api .

RUN yarn install --frozen-lockfile

RUN yarn build

RUN yarn seed

EXPOSE 1337