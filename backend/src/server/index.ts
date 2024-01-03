import cors from '@fastify/cors';
import Fastify from 'fastify';
import * as http from 'http';

import db from '../db/index.js';
import { BUCKET_NAME, CORS_ORIGIN, ENABLE_FASTIFY_LOGGING } from '../services/config.js';
import { minioClient } from '../services/minio-client.js';
import type { AuthenticatedUser, customRequest, requestGeneric } from '../typings.js';
import { apolloHandler } from './apollo.js';
import { fastifyWsHandler } from './fastify-ws.js';
import { hocuspocusHandler } from './hocuspocus.js';

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

// Handle all requests that have the `Content-Type` header set as multipart
fastify.addContentTypeParser('multipart', async (request) => {
  request.isMultipart = true;
});

await db.init();

await fastifyWsHandler(fastify);

await hocuspocusHandler(fastify);

await apolloHandler(fastify);

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

export default fastify;
