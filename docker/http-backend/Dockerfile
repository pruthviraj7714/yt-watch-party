FROM node:20-alpine

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY pnpm-workspace.yaml ./

COPY ./packages ./packages
COPY ./apps/http-backend ./apps/http-backend

RUN corepack enable && pnpm install --frozen-lockfile

RUN pnpm --filter=@repo/db exec prisma generate

EXPOSE 3001

WORKDIR /usr/src/app/apps/http-backend

RUN pnpm --filter=http-backend run build

CMD ["pnpm", "start"]