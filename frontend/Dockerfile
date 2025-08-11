FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
