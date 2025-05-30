FROM node:20-alpine

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY pnpm-workspace.yaml ./

COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend

RUN corepack enable && pnpm install --frozen-lockfile

EXPOSE 8080

WORKDIR /usr/src/app/apps/ws-backend

RUN pnpm --filter=ws-backend run build

CMD ["pnpm", "start"]