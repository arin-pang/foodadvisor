ARG NODE_IMAGE=node:erbium-alpine

FROM $NODE_IMAGE AS build

RUN apk add git

WORKDIR /usr/src/food-advisor

COPY . ./client

WORKDIR /usr/src/food-advisor/client

RUN ls

RUN yarn install --frozen-lockfile

RUN yarn build

FROM nginx AS final

COPY --from=build /usr/src/food-advisor/client/www /usr/share/nginx/html

RUN ls