FROM node:20-alpine

ARG DATABASE_URL

WORKDIR /usr/src/app

COPY pnpm-lock.yaml .
COPY package.json .
COPY turbo.json .

COPY ./packages ./packages
COPY ./apps/http-backend ./apps/http-backend

COPY pnpm-workspace.yaml .   

RUN corepack enable && pnpm install --frozen-lockfile

RUN cd packages/db && DATABASE_URL=$DATABASE_URL npx prisma generate

EXPOSE 3001

WORKDIR /usr/src/app/apps/http-backend

RUN pnpm --filter=http-backend run build

CMD ["pnpm", "start"]
