# OpenPro Project Managment

<img src="frontend/public/images/openpro-logo.svg" alt="openpro-logo" width="250"/>

This repository hosts the code for a comprehensive project management platform tailored for software engineers.
It provides a robust set of features that facilitate task tracking, team collaboration, and project progress visualization.
The platform is designed to streamline the software development process, making it easier for teams to plan, track, and release software.

⚠️ Under very active development. Not ready for production use.

![GitHub contributors](https://img.shields.io/github/contributors/openpro-io/openpro)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/openpro-io/openpro/docker-image.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7614767a1f8c49ff8ca41f3257ca6740)](https://app.codacy.com/gh/openpro-io/openpro/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![License](https://img.shields.io/github/license/golangci/golangci-lint)](/LICENSE.txt)
[![Release](https://img.shields.io/github/release/openpro-io/openpro.svg)](https://github.com/openpro-io/openpro/releases/latest)
[![](https://dcbadge.vercel.app/api/server/3WxA2pz7YB)](https://discord.gg/3WxA2pz7YB)
[![](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/claygorman)

## 📸 Screenshots

<img src="https://github.com/openpro-io/openpro/assets/4524500/d870d4dc-11d8-450b-b77a-cba105abff08" width="280" />
<img src="https://github.com/openpro-io/openpro/assets/4524500/473392d7-3251-48ef-bad0-b689d7c5d5f1" width="315" />
<img src="https://github.com/openpro-io/openpro/assets/4524500/92b2137f-5e79-4f25-9786-400f1638d09c" width="320" />

## 🚀 Features

- SSO integration with nextauth is a 1st class citizen
- Presently supports only kanban boards
- Can make multiple projects
- Rich text editor for task descriptions and comments
- Uses Apollo GraphQL for API and Next.js for frontend

## 📚 Stack

- JS/TS (Language)
- Next.js (React)
- Fastify/Apollo (Node.js)
- Postgres (SQL)
- Minio (S3 compatible storage)

## Supported Architectures

We utilise the docker manifest for multi-platform awareness. More information is available from docker [here](https://distribution.github.io/distribution/spec/manifest-v2-2/#manifest-list).

Simply pulling `ghcr.io/openpro-io/openpro-backend:latest` or  `ghcr.io/openpro-io/openpro-frontend:latest` should retrieve the correct image for your arch, but you can also pull specific arch images via tags.

The architectures supported by this image are:

| Architecture | Available | Tag |
|:------------:|:---------:|-----|
|    x86-64    |     ✅     |     |
|    arm64     |     ✅     |     |
|    armhf     |     ❌     |     |

## Application Setup

Access the UI at `:3000` at your frontend container.

## Usage

To help you get started creating a container from this image you can either use docker-compose or the docker cli.

### docker-compose (production)

Here is my setup (slightly redacted) for a production setup.

```yaml
---
version: "3.8"

networks:
  internal:
  # This is a network from another stack that container nginx proxy manager which is why its external
  nginx-proxy-manager-nw:
    external: true

# I would probably make these volumes a host bind r/w volume
volumes:
  uploads:
  pgdata:

services:
  postgresql-db:
    image: postgres:16
    environment:
      POSTGRES_USER: REDACTED
      POSTGRES_PASSWORD: REDACTED
      POSTGRES_DB: postgres
    networks:
      - internal
    volumes:
      - pgdata:/var/lib/postgresql/data

  openpro-minio:
    image: minio/minio
    environment:
      MINIO_PORT: 9000
      MINIO_HOST: openpro-minio
      MINIO_ROOT_USER: REDACTED
      MINIO_ROOT_PASSWORD: REDACTED
    pull_policy: always
    restart: unless-stopped
    networks:
      - internal
    command: server /uploads --console-address ":9090"
    volumes:
      - uploads:/uploads

  createbuckets:
    image: minio/mc
    environment:
      MINIO_PORT: 9000
      MINIO_HOST: openpro-minio
      MINIO_ROOT_USER: REDACTED
      MINIO_ROOT_PASSWORD: REDACTED
      BUCKET_NAME: uploads
    pull_policy: always
    networks:
      - internal
    entrypoint: >
      /bin/sh -c "
      /usr/bin/mc config host add openpro-minio http://openpro-minio:9000 REDACTED REDACTED;
      /usr/bin/mc mb openpro-minio/uploads;
      /usr/bin/mc anonymous set download openpro-minio/uploads;
      "
    depends_on:
      - openpro-minio

  openpro-backend:
    image: ghcr.io/openpro-io/openpro-backend:latest
    environment:
      HTTP_PORT: 8080
      SQL_URI: postgres://REDACTED:REDACTED@postgresql-db:5432/postgres
      BUCKET_NAME: uploads
      # Minio
      MINIO_PORT: 9000
      MINIO_HOST: openpro-minio
      MINIO_ROOT_USER: REDACTED
      MINIO_ROOT_PASSWORD: REDACTED
      ENABLE_FASTIFY_LOGGING: true
      CORS_ORIGIN: https://openpro.mydomain.com
      FRONTEND_HOSTNAME: http://openpro-openpro-frontend-1:3000
    networks:
      - internal
      - nginx-proxy-manager-nw
    depends_on:
      - postgresql-db
      - createbuckets
    #ports:
    #  - "8080:8080"

  openpro-frontend:
    image: ghcr.io/openpro-io/openpro-frontend:latest
    environment:
      NEXT_PUBLIC_API_URL: https://openpro-backend.mydomain.com
      API_URL: http://openpro-openpro-backend-1:8080
      NEXTAUTH_URL: https://openpro.mydomain.com
      NEXTAUTH_SECRET: REDACTED
      NEXT_PUBLIC_NEXTAUTH_URL: https://openpro.mydomain.com
      NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER: keycloak
      AUTH_KEYCLOAK_ISSUER: REDACTED
      AUTH_KEYCLOAK_ID: REDACTED
      AUTH_KEYCLOAK_SECRET: REDACTED
      KEYCLOAK_BASE_URL: https://auth.mydomain.com
    networks:
      - internal
      - nginx-proxy-manager-nw
    depends_on:
      - openpro-backend
    #ports:
    #  - "3000:3000"
```

### docker cli ([click here for more info](https://docs.docker.com/engine/reference/commandline/cli/))

## Parameters

### Backend Ports (`-p`)

| Port | Description                                  | 
|------|----------------------------------------------|
| 8080 | The main port for the API + Websocket server |

### Backend Environment Variables (`-e`)

| Env                      | Description                                                                                                                          | Default | Value Type | Required           |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------|---------|------------|--------------------|
| HTTP_PORT                | The port of the http server                                                                                                          | 8080    | number     | :x:                |
| SQL_URI                  | This is a full URI for sql. Looks like `postgres://postgres:postgres@postgresql-db:5432/postgres`                                    |         | string     | :heavy_check_mark: |
| BUCKET_NAME              | The minio primary bucket used for storing assets.                                                                                    | uploads | string     | :heavy_check_mark: |
| USE_MINIO                | Should we use minio. There is a possibility to fallback to disk but its WIP.                                                         | 1       | boolean    | :x:                |
| MINIO_PORT               | The port for communication of asset transfer.                                                                                        | 9000    | number     | :x:                |
| MINIO_HOST               | The hostname for communication of asset transfer. Example is container name `openpro-minio`                                          |         | string     | :heavy_check_mark: |
| MINIO_ROOT_USER          | The username for communication of asset transfer. This can be an iam aws access key.                                                 |         | string     | :heavy_check_mark: |
| MINIO_ROOT_PASSWORD      | The password for communication of asset transfer.This can be an iam aws secret key.                                                  |         | string     | :heavy_check_mark: |
| FRONTEND_HOSTNAME        | This tells the backend how to talk to the frontend. This is usually a container to container call. Example is `http://frontend:3000` |         | string     | :heavy_check_mark: |
| ALLOW_SIGNUP             | If this is false then your site goes into invite only mode.                                                                          |         | boolean    | :x:                |
| ALLOW_LOGIN_EMAILS_LIST  | A list of comma seperated emails to allow signing in. IE `a@abc.com,b@def.com`                                                       |         | string     | :x:                |
| ALLOW_LOGIN_DOMAINS_LIST | A list of comma seperated domains to allow signing in. IE `abc.com,def.com`                                                          |         | string     | :x:                |

### Frontend Ports (`-p`)

| Port | Description          | 
|------|----------------------|
| 3000 | The main port the UI |

### Frontend Environment Variables (`-e`)

| Env                                | Description                                                                                                                      | Default | Required            |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|---------|---------------------|
| NEXT_PUBLIC_API_URL                | Tells the application where the backend is. This is usually a FQDN. The client browser must have access to this url.             |         | :heavy_check_mark:  |
| API_URL                            | This is for when you want to tell the server side code to use a different url. This can often be the container:port combination. |         | :x:                 |
| NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER | Currently we have tested `keycloak` and `github` but in theory you can use anything nextauth supports.                           |         | :heavy_check_mark:  |
| NEXTAUTH_URL                       | This is the url of your frontend public facing.                                                                                  |         | :heavy_check_mark:  |
| NEXTAUTH_SECRET                    | You must generate this yourself. `openssl rand -base64 32`                                                                       |         | :heavy_check_mark:  |
| NEXT_PUBLIC_NEXTAUTH_URL           | This is the url of your frontend public facing. NOTE: We might be able to use this entirely and deprecate `NEXTAUTH_URL`         |         | :heavy_check_mark:  |
| AUTH_KEYCLOAK_ID                   | Required if `NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER=keycloak`. This is client ID typically.                                          |         | :heavy_check_mark:* |
| AUTH_KEYCLOAK_SECRET               | Required if `NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER=keycloak`. This is client secret typically.                                      |         | :heavy_check_mark:* |
| AUTH_KEYCLOAK_ISSUER               | Required if `NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER=keycloak`. Typically looks like `https://domain.com/realms/REALMNAME`            |         | :heavy_check_mark:* |
| GITHUB_CLIENT_ID                   | Required if `NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER=github`.                                                                         |         | :heavy_check_mark:* |
| GITHUB_CLIENT_SECRET               | Required if `NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER=github`.                                                                         |         | :heavy_check_mark:* |

# Running a reverse proxy

If you are running these behind a reverse proxy like nginx proxy manager you will need to add the following to your proxy host for `frontend` under advanced tab.

The reason for this is nextauth payloads can be very large when redirecting back from the oauth provider.

Without these you may get a `5XX` error.

```
proxy_buffers 8 16k;
proxy_buffer_size 32k;
```

<img src="readme-assets/npm-advanced-tab.png" alt="npm-advanced-tab" width="250"/>

# Minio

Minio is a self-hosted s3 compatible storage solution. We use this to store assets for the application.

You can generate dummy AWS creds using https://canarytokens.org/generate# and select AWS Keys for `MINO_ROOT_USER` and `MINIO_ROOT_PASSWORD`.

You do not have to use this of course but please make sure you use something secure.

I also would read documentation on minio thoroughly. I don't recommend using the root keys in your frontend application.

Please follow security best practices!!

https://min.io/docs/minio/container/administration/console/security-and-access.html



