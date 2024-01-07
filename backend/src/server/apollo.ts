import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
import type { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql/error';

import db from '../db/index.js';
import type { User } from '../db/models/types.js';
import resolvers from '../resolvers/index.js';
import typeDefs from '../type-defs.js';
import type { CustomFastifyRequest } from '../typings.js';

export const apolloHandler = async (fastify: FastifyInstance) => {
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

  const myContextFunction = async (request: CustomFastifyRequest): Promise<object> => {
    // get the user token from the headers
    let user: User | null = request?.user;

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
};
