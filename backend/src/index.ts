import { ApolloServer } from '@apollo/server';
import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify';
import cors from '@fastify/cors';
import { fastifyWebsocket } from '@fastify/websocket';
import axios from 'axios';
import Fastify, { FastifyRequest, RequestGenericInterface } from 'fastify';
import processRequest from 'graphql-upload/processRequest.mjs';
import { GraphQLError } from 'graphql/error/index.js';
import { nanoid } from 'nanoid';
import { Readable } from 'stream';
import * as http from 'http';

import db from './db/index.js';
import resolvers from './resolvers/index.js';
import {
  ALLOW_LOGIN_DOMAINS_LIST,
  ALLOW_LOGIN_EMAILS_LIST,
  ALLOW_SIGNUP,
  BUCKET_NAME,
  CORS_ORIGIN,
  ENABLE_FASTIFY_LOGGING,
  FRONTEND_HOSTNAME,
  HTTP_PORT,
} from './services/config.js';
import hocuspocusServer from './services/hocuspocus-server.js';
import { minioClient } from './services/minio-client.js';
import * as wsServer from './services/ws-server.js';
import typeDefs from './type-defs.js';

interface IQuerystring {}

interface IHeaders {
  connection?: string;
}

interface IParams {
  file?: any;
}

interface IReply {
  200?: { success: boolean };
  302?: { url: string };
  401?: { error: string };
  error?: string;
  Readable?: Readable;
  ReadableBase?: Readable;
}

interface requestGeneric extends RequestGenericInterface {
  Querystring: IQuerystring;
  Headers: IHeaders;
  Reply: IReply;
  Params: IParams;
}

interface customRequest extends http.IncomingMessage {
  isMultipart?: boolean;
}

interface AuthenticatedUser {
  user: any;
}

type CustomFastifyRequest = FastifyRequest<{
  Body: {
    query?: string;
    variables?: any;
  };
  Headers: {
    authorization?: string;
  };
}>;

declare module 'fastify' {
  export interface FastifyRequest {
    user?: AuthenticatedUser;
    isMultipart?: boolean;
  }
}

const fastify = Fastify<http.Server, customRequest>({
  logger: ENABLE_FASTIFY_LOGGING,
  keepAliveTimeout: 61 * 1000,
});

fastify.server.headersTimeout = 65 * 1000;

await fastify.register(cors, {
  origin: (origin, cb) => {
    // TODO: ENV VAR this... maybe a.com,b.com and split and test
    if (
      /localhost/.test(origin) ||
      /qa\.openpro\.io/.test(origin) ||
      /openpro\.io/.test(origin) ||
      CORS_ORIGIN === origin ||
      origin === null ||
      origin === undefined
    ) {
      cb(null, true);
      return;
    }
    console.log('Blocked by CORS', { origin });
    // Generate an error on other origins, disabling access
    cb(new Error('Not allowed'), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'apollographql-client-name',
    'apollographql-client-version',
    'Apollo-Require-Preflight',
  ],
  exposedHeaders: [],
  credentials: true,
});

await fastify.register(fastifyWebsocket, {
  options: { maxPayload: 1048576, clientTracking: true },
});

fastify.addHook<requestGeneric>('preValidation', async (request, reply) => {
  // check if the request is authenticated
  // TODO: Refactor to make this cleaner
  if (request.headers.connection === 'Upgrade' && request.url === '/ws') {
    const token = request.headers['sec-websocket-protocol']
      .split(',')
      .map((x) => x.trim())[1];
    let user = null;

    try {
      // TODO: maybe we just call the url of the caller origin
      const { data } = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // TODO: We can inject from DB here the whitelist domains and emails in addition to ENV vars

      if (
        ALLOW_LOGIN_EMAILS_LIST.length > 0 &&
        !ALLOW_LOGIN_EMAILS_LIST.includes(data.email)
      ) {
        throw new GraphQLError('Email is not allowed to login', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }

      if (
        ALLOW_LOGIN_DOMAINS_LIST.length > 0 &&
        !ALLOW_LOGIN_DOMAINS_LIST.includes(
          data.email.split('@')[1].toLowerCase()
        )
      ) {
        throw new GraphQLError('Email is not allowed to login', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }

      const externalId = `${data.provider}__${data.sub}`;

      user = await db.sequelize.models.User.findOne({
        where: { externalId },
      });

      if (!user && ALLOW_SIGNUP) {
        try {
          const [firstName, lastName] = data.name.split(' ');

          user = await db.sequelize.models.User.create({
            email: data.email,
            externalId,
            firstName,
            lastName,
          });
        } catch (e) {}
      }

      request.user = user;
    } catch (e) {
      if (e?.response?.status === 401) {
        reply.code(401).send({ error: 'not authenticated' });
      } else {
        // TODO: We should probably throw a 500 here and log the error
        console.error({ e });
      }
    }
  }
});

await fastify.register(async function (fastify) {
  fastify.websocketServer.on('connection', function connection(ws) {
    ws.isAlive = true;

    // Heartbeat
    ws.on('message', function (message) {
      const msg = message.toString();
      if (['ping', 'pong'].includes(msg)) {
        this.isAlive = true;
        ws.send(msg === 'ping' ? 'pong' : 'ping');
      }
    });
  });

  const interval = setInterval(function ping() {
    fastify.websocketServer.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
    });
  }, 30000);

  fastify.websocketServer.on('close', function close() {
    clearInterval(interval);
  });

  fastify.get(
    '/ws',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      const context = {};

      connection.socket.id = nanoid();
      connection.socket.user = req?.user;
      connection.socket.namespace = 'ws';
      const clients = fastify.websocketServer.clients;

      wsServer.handleConnection({
        socket: connection.socket,
        req,
        context,
        clients,
      });
    }
  );
});

await fastify.register(async function (fastify) {
  fastify.get(
    '/collaboration',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      const context = {};

      // @ts-ignore
      hocuspocusServer.handleConnection(connection.socket, req, context);
    }
  );
});

// Handle all requests that have the `Content-Type` header set as multipart
fastify.addContentTypeParser('multipart', function (request, done) {
  request.isMultipart = true;
  done();
});

// Format the request body to follow graphql-upload's
fastify.addHook('preValidation', async function (request, reply) {
  if (!request?.isMultipart) {
    return;
  }

  request.body = await processRequest(request.raw, reply.raw);
});

await db.init();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  // Using graphql-upload without CSRF prevention is very insecure.
  csrfPrevention: true,
  cache: 'bounded',
  allowBatchedHttpRequests: true,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

const myContextFunction = async (
  request: CustomFastifyRequest
): Promise<object> => {
  // get the user token from the headers
  const token = request.headers.authorization;
  let user = null;

  if (!token) return { db, user };

  // Allow if introspection query only
  if (
    !Array.isArray(request.body) &&
    request?.body?.query?.includes('IntrospectionQuery')
  ) {
    return {
      db,
      user,
    };
  }

  // TODO: maybe we dont make this optional
  if (token) {
    try {
      // TODO: maybe we just call the url of the caller origin
      const { data } = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
        headers: { Authorization: request.headers.authorization },
      });

      // TODO: We can inject from DB here the whitelist domains and emails in addition to ENV vars

      if (
        ALLOW_LOGIN_EMAILS_LIST.length > 0 &&
        !ALLOW_LOGIN_EMAILS_LIST.includes(data.email)
      ) {
        throw new GraphQLError('Email is not allowed to login', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }

      if (
        ALLOW_LOGIN_DOMAINS_LIST.length > 0 &&
        !ALLOW_LOGIN_DOMAINS_LIST.includes(
          data.email.split('@')[1].toLowerCase()
        )
      ) {
        throw new GraphQLError('Email is not allowed to login', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }

      const externalId = `${data.provider}__${data.sub}`;

      user = await db.sequelize.models.User.findOne({ where: { externalId } });

      if (!user && ALLOW_SIGNUP) {
        try {
          const [firstName, lastName] = data.name.split(' ');

          user = await db.sequelize.models.User.create({
            email: data.email,
            externalId,
            firstName,
            lastName,
          });
        } catch (e) {}
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      } else {
        // TODO: We should probably throw a 500 here and log the error
        console.error({ e });
      }
    }
  }

  // optionally block the user
  // we could also check user roles/permissions here
  if (!user) {
    // throwing a `GraphQLError` here allows us to specify an HTTP status code,
    // standard `Error`s will have a 500 status code by default
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  return {
    websocketServer: fastify?.websocketServer,
    db,
    user,
  };
};

fastify.post(
  '/graphql',
  fastifyApolloHandler(apollo, {
    context: myContextFunction,
  })
);

fastify.get<requestGeneric>('/uploads/:file', async (request, reply) => {
  // TODO: make sure logged in
  const { file } = request.params;

  const result = await minioClient.getObject(BUCKET_NAME, file);

  // @ts-ignore
  reply.header('Content-Type', result.headers['content-type']);
  // @ts-ignore
  reply.header('Content-Length', result.headers['content-length']);

  // @ts-ignore
  return reply.send(result);
});

// TODO: this used to read from filesystem
//
// fastify.get('/assets/avatars/:file', async (request, reply) => {
//   const { file } = request.params;
//   const filePath = path.join(ASSET_PATH, 'avatars', file);
//
//   // Check if the file exists
//   try {
//     await fs.access(filePath);
//   } catch (error) {
//     reply.code(404).send({ error: 'File not found' });
//     return;
//   }
//
//   // Set the headers
//   reply.header('Content-Type', 'image/webp');
//
//   const buffer = await fs.readFile(filePath);
//   reply.send(buffer);
// });

await fastify.listen({ port: Number(HTTP_PORT), host: '0.0.0.0' });

console.log(`server listening on ${HTTP_PORT}`);
