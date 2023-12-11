<!-- omit in toc -->
# Contributing to openpro

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->
## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
- [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)



## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation]().

Before you ask a question, it is best to search for existing [Issues](https://github.com/openpro-io/openpro/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/openpro-io/openpro/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

<!--
You might want to create a separate issue tag for questions and include it in this description. People should then tag their issues accordingly.

Depending on how large the project is, you may want to outsource the questioning, e.g. to Stack Overflow or Gitter. You may add additional contact and information possibilities:
- IRC
- Slack
- Gitter
- Stack Overflow tag
- Blog
- FAQ
- Roadmap
- E-Mail List
- Forum
-->

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/openpro-io/openproissues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
- Stack trace (Traceback)
- OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
- Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
- Possibly your input and the output
- Can you reliably reproduce the issue? And can you also reproduce it with older versions?

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <>.
<!-- You may add a PGP key to allow the messages to be sent encrypted as well. -->

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/openpro-io/openpro/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

<!-- You might want to create an issue template for bugs and errors that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->


### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for openpro, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation]() carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/openpro-io/openpro/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/openpro-io/openpro/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most openpro users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Your First Code Contribution

To help you get started creating a container from this image you can either use docker-compose or the docker cli.

### docker-compose (development)

```yaml
---
version: "3.8"

networks:
  internal:

volumes:
  uploads:
  pgdata:
  backend_node_modules:
  frontend_node_modules:

x-minio-env-variables: &minio-env-variables
  MINIO_PORT: 9000
  MINIO_HOST: openpro-minio
  MINIO_ROOT_USER: access-key
  MINIO_ROOT_PASSWORD: secret-key

services:
  ntfy:
    image: binwiederhier/ntfy
    container_name: ntfy
    command:
      - serve
    environment:
      TZ: UTC # optional: set desired timezone
      NTFY_BASE_URL: http://localhost:8093
      NTFY_CACHE_FILE: /var/lib/ntfy/cache.db
      NTFY_AUTH_FILE: /var/lib/ntfy/auth.db
      NTFY_AUTH_DEFAULT_ACCESS: read-write
      NTFY_BEHIND_PROXY: true
      NTFY_ATTACHMENT_CACHE_DIR: /var/lib/ntfy/attachments
      NTFY_ENABLE_LOGIN: true
      NTFY_VISITOR_REQUEST_LIMIT_BURST: 180
      NTFY_VISITOR_SUBSCRIPTION_LIMIT: 50
    #user: UID:GID # optional: replace with your own user/group or uid/gid
    volumes:
      - ./ntfy:/var/lib/ntfy
    ports:
      - "8093:80"
    networks:
      - internal
    healthcheck: # optional: remember to adapt the host:port to your environment
      test:
        [
          "CMD-SHELL",
          "wget -q --tries=1 http://localhost:80/v1/health -O - | grep -Eo '\"healthy\"\\s*:\\s*true' || exit 1",
        ]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  postgresql-db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    networks:
      - internal
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  openpro-minio:
    image: minio/minio
    container_name: openpro-minio
    environment:
      <<: *minio-env-variables
    pull_policy: always
    restart: unless-stopped
    networks:
      - internal
    command: server /uploads --console-address ":9090"
    volumes:
      - uploads:/uploads
    ports:
      - "9000:9000"
      - "9090:9090"

  createbuckets:
    image: minio/mc
    environment:
      <<: *minio-env-variables
      BUCKET_NAME: uploads
    pull_policy: always
    networks:
      - internal
    entrypoint: >
      /bin/sh -c " /usr/bin/mc config host add openpro-minio http://\$MINIO_HOST:\$MINIO_PORT \$MINIO_ROOT_USER \$MINIO_ROOT_PASSWORD; /usr/bin/mc mb openpro-minio/\$BUCKET_NAME; /usr/bin/mc anonymous set download openpro-minio/\$BUCKET_NAME; exit 0; "
    depends_on:
      - openpro-minio

  backend:
    container_name: backend
    build:
      context: ./backend
      dockerfile: ./Dockerfile.local
      args:
        DOCKER_BUILDKIT: 1
    environment:
      SQL_URI: postgres://postgres:postgres@postgresql-db:5432/postgres
      BUCKET_NAME: uploads
      # Assets
      ASSET_PATH: /app/assets
      ASSET_PROVIDER: minio
      # Minio
      USE_MINIO: 1
      <<: *minio-env-variables
    networks:
      - internal
    volumes:
      - ./backend:/app
      - backend_node_modules:/app/node_modules
    depends_on:
      - postgresql-db
      - createbuckets

  frontend:
    container_name: frontend
    build:
      context: ./frontend
      dockerfile: ./Dockerfile.local
      args:
        DOCKER_BUILDKIT: 1
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080
      NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER: <keycloak|github>
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: <secret>
      NEXT_PUBLIC_NEXTAUTH_URL: http://localhost:3000
      # Keycloak - optional if using keycloak
      AUTH_KEYCLOAK_ID: <kecloack-id>
      AUTH_KEYCLOAK_SECRET: <secret>
      AUTH_KEYCLOAK_ISSUER: <issuer>
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:
      NEXT_PUBLIC_KEYCLOAK_URL:
      NEXT_PUBLIC_KEYCLOAK_REALM:
      # GitHub - optional if using GitHub
      GITHUB_CLIENT_ID: <client-id>
      GITHUB_CLIENT_SECRET: <client-secret>
      # OpenAi - Optional
      #OPENAI_API_BASE: "https://api.openai.com/v1" # change if using a custom endpoint
      #OPENAI_API_KEY: "sk-" # add your openai key here
      #GPT_ENGINE: "gpt-3.5-turbo" # use "gpt-4" if you have access
      # Nfty
      NTFY_WS_HOST: localhost:8093
      NTFY_WS_SSL: false
      PUBLIC_NTFY_HTTP_SSL: false
    networks:
      - internal
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - frontend_node_modules:/app/node_modules
    depends_on:
      - backend
      - ntfy
```


### Improving The Documentation
<!-- TODO
Updating, improving and correcting the documentation

-->

## Styleguides
### Commit Messages
<!-- TODO

-->

## Join The Project Team
<!-- TODO -->

<!-- omit in toc -->
## Attribution
This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!
