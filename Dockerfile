#step 1
FROM node:14-alpine as builder
WORKDIR /app
COPY packaje.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn buildam