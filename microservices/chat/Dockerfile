FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g npm@10.8.0

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD [ "pnpm", "run", "start:dev", "chat" ]


FROM node:20-alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist


CMD ["node","dist/microservices/chat/main"]