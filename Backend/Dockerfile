FROM node:22 AS node-backend-build

WORKDIR /app

COPY package.json package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:22

WORKDIR /app

COPY --from=node-backend-build /app/package.json /app/package-lock.json ./
COPY --from=node-backend-build /app/dist ./dist


RUN npm ci --omit=dev

CMD ["npm", "run", "start:prod"]