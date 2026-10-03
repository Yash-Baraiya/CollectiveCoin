FROM node:22 AS node-build

WORKDIR /src

COPY package.json package-lock.json .

RUN ["npm" , "ci"]

COPY . .

RUN ["npm" , "run" , "build" ]

FROM nginx:stable-alpine

COPY --from=node-build /src/dist/collective-coin/browser /usr/share/nginx/html

