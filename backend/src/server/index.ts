import cors, { OriginFunction } from '@fastify/cors';
import Fastify, { FastifyRequest } from 'fastify';
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

const corsHandler: OriginFunction = (origin, cb) => {
  // undefined is for SSR to backend server requests
  if (CORS_ORIGIN.split(',').includes(origin) || origin === undefined) {
    cb(null, true);
    return;
  }
  console.log('Blocked by CORS', { origin });
  cb(new Error('Not allowed'), false);
};

await fastify.register(cors, {
  origin: corsHandler,
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
fastify.addContentTypeParser('multipart', {}, async (request: FastifyRequest) => {
  // https://github.com/jaydenseric/graphql-upload
  request.isMultipart = true;
});

await db.init();

await fastifyWsHandler(fastify);

await hocuspocusHandler(fastify);

await apolloHandler(fastify);

type MinioGetObjectResponse = {
  stream: NodeJS.ReadableStream;
  headers: {
    'content-type': string;
    'content-length': string;
    'last-modified': string;
    etag: string;
    server: string;
    'accept-ranges': string;
    date: string;
    vary: string;
    'x-amz-meta-uploaded-by-user-id': string;
  };
};

fastify.get<requestGeneric>('/uploads/:file', async (request, reply) => {
  // TODO: make sure logged in
  const { file } = request.params;

  // TODO: need better TS fix here
  const result = (await minioClient.getObject(BUCKET_NAME, file)) as unknown as MinioGetObjectResponse;

  reply.header('Content-Type', result.headers['content-type']);
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
