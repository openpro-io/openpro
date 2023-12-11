import Fastify from 'fastify';
import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
import typeDefs from './type-defs.js';
import resolvers from './resolvers.js';
import { HTTP_PORT, BUCKET_NAME, CORS_ORIGIN } from './services/config.js';
import { db } from './db/index.js';
import { GraphQLError } from 'graphql/error/index.js';
import * as cors from '@fastify/cors';
import axios from 'axios';
import processRequest from 'graphql-upload/processRequest.mjs';
import { minioClient } from './services/minio-client.js';

const fastify = Fastify({
  logger: process.env.ENABLE_FASTIFY_LOGGING === 'true',
  keepAliveTimeout: 61 * 1000,
});

fastify.server.headersTimeout = 65 * 1000;

fastify.register(cors, {
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
    cb(new Error('Not allowed'));
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
fastify.addContentTypeParser('multipart', (request, payload, done) => {
  request.isMultipart = true;
  done();
});

// Format the request body to follow graphql-upload's
fastify.addHook('preValidation', async function (request, reply) {
  if (!request.isMultipart) {
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

const myContextFunction = async (request) => {
  // get the user token from the headers
  const token = request.headers.authorization || '';
  let user = null;

  // TODO: maybe we dont make this optional
  if (token) {
    try {
      const { data } = await axios.get(`http://frontend:3000/api/verify-jwt`, {
        headers: { Authorization: request.headers.authorization },
      });

      const externalId = `${data.provider}__${data.sub}`;

      user = await db.sequelize.models.User.findOne({ where: { externalId } });

      if (!user) {
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

  // Allow if introspection query only
  if (!Array.isArray(request.body) && request?.body?.query?.includes('IntrospectionQuery')) {
    return {
      db,
      user,
    };
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

fastify.get('/uploads/:file', async (request, reply) => {
  // TODO: make sure logged in
  const { file } = request.params;
  return await minioClient.getObject(BUCKET_NAME, file);
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

await fastify.listen({ port: HTTP_PORT, host: '0.0.0.0' });

console.log(`server listening on ${HTTP_PORT}`);
