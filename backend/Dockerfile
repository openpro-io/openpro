FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS build
# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --prod
ADD . ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --offline --prod

FROM base
COPY --from=build /app /app

RUN npm install pm2 -g

EXPOSE 8080

CMD ["./start.sh"]
