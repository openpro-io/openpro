# openpro/openpro

This repository hosts the code for a comprehensive project management platform tailored for software engineers. It provides a robust set of features that facilitate task tracking, team collaboration, and project progress visualization. The platform is designed to streamline the software development
process, making it easier for teams to plan, track, and release software.

[![Docker Image CI](https://github.com/openpro-io/openpro/actions/workflows/docker-image.yml/badge.svg)](https://github.com/openpro-io/openpro/actions/workflows/docker-image.yml)
[![License](https://img.shields.io/github/license/golangci/golangci-lint)](/LICENSE.txt)
[![Release](https://img.shields.io/github/release/openpro-io/openpro.svg)](https://github.com/openpro-io/openpro/releases/latest)
[![](https://dcbadge.vercel.app/api/server/3WxA2pz7YB)](https://discord.gg/3WxA2pz7YB)
[![](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/claygorman)

## Supported Architectures

We utilise the docker manifest for multi-platform awareness. More information is available from docker [here](https://distribution.github.io/distribution/spec/manifest-v2-2/#manifest-list).

Simply pulling `ghcr.io/openpro-io/openpro-backend:latest` or  `ghcr.io/openpro-io/openpro-frontend:latest` should retrieve the correct image for your arch, but you can also pull specific arch images via tags.

The architectures supported by this image are:

| Architecture | Available | Tag                     |
|:------------:|:---------:|-------------------------|
|    x86-64    |     ✅     | amd64-\<version tag\>   |
|    arm64     |     ✅     | arm64v8-\<version tag\> |
|    armhf     |     ❌     |                         |

## Application Setup

TODO:

## Usage

To help you get started creating a container from this image you can either use docker-compose or the docker cli.

### docker-compose (development)

```yaml
---
version: "3.8"

TODO:
```

### docker cli ([click here for more info](https://docs.docker.com/engine/reference/commandline/cli/))

## Parameters

### Backend Ports (`-p`)

| Port | Description                                  | 
|------|----------------------------------------------|
| 8080 | The main port for the API + Websocket server |

### Backend Environment Variables (`-e`)

| Env                 | Description                                                                                                                          | Default | Required           |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------|---------|--------------------|
| HTTP_PORT           | The port of the http server                                                                                                          | 8080    | :x:                |
| SQL_URI             | This is a full URI for sql. Looks like `postgres://postgres:postgres@postgresql-db:5432/postgres`                                    |         | :heavy_check_mark: |
| BUCKET_NAME         | The minio primary bucket used for storing assets.                                                                                    | uploads | :heavy_check_mark: |
| USE_MINIO           | Should we use minio. There is a possibility to fallback to disk but its WIP.                                                         | 1       | :x:                |
| MINIO_PORT          | The port for communication of asset transfer.                                                                                        | 9000    | :x:                |
| MINIO_HOST          | The hostname for communication of asset transfer. Example is container name `openpro-minio`                                          |         | :heavy_check_mark: |
| MINIO_ROOT_USER     | The username for communication of asset transfer. This can be an iam aws access key.                                                 |         | :heavy_check_mark: |
| MINIO_ROOT_PASSWORD | The password for communication of asset transfer.This can be an iam aws secret key.                                                  |         | :heavy_check_mark: |
| FRONTEND_HOSTNAME   | This tells the backend how to talk to the frontend. This is usually a container to container call. Example is `http://frontend:3000` |         | :heavy_check_mark: |

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

