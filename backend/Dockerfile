FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat


FROM base AS build
WORKDIR /app
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache g++ make python3 py3-pip && ln -sf python3 /usr/bin/python
# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY . ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline
RUN pnpm run build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline --prod


FROM base
WORKDIR /app
COPY --from=build /app /app
RUN npm install pm2 -g
EXPOSE 8080
CMD ["./start.sh"]
