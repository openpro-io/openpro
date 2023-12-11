# openpro/openpro



This repository hosts the code for a comprehensive project management platform tailored for software engineers. It provides a robust set of features that facilitate task tracking, team collaboration, and project progress visualization. The platform is designed to streamline the software development process, making it easier for teams to plan, track, and release software.

[![Docker Image CI](https://github.com/openpro-io/openpro/actions/workflows/docker-image.yml/badge.svg)](https://github.com/openpro-io/openpro/actions/workflows/docker-image.yml)
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

| Parameter | Function |
|:---------:|----------|
|           |          |
