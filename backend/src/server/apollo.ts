import { ApolloServer } from '@apollo/server';
import {
  type ApolloFastifyContextFunction,
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify';
import { EXPECTED_OPTIONS_KEY, createContext } from 'dataloader-sequelize';
import type { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql';

import db from '../db/index.js';
import type { User } from '../db/models/types.js';
import resolvers from '../resolvers/index.js';
import typeDefs from '../type-defs.js';
import type { CustomFastifyRequest } from '../typings.js';

type DataloaderCreateContext = {
  loaders: any;
  prime: (data: any) => void;
};

export interface ApolloContext {
  websocketServer: any;
  db: typeof db;
  user: User | null;
  dataLoaderContext: DataloaderCreateContext;
  EXPECTED_OPTIONS_KEY: typeof EXPECTED_OPTIONS_KEY;
}

export const apolloHandler = async (fastify: FastifyInstance) => {
  const apollo = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
    // Using graphql-upload without CSRF prevention is very insecure.
    csrfPrevention: true,
    cache: 'bounded',
    allowBatchedHttpRequests: true,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  await apollo.start();

  const myContextFunction: ApolloFastifyContextFunction<ApolloContext> = async (request: CustomFastifyRequest) => {
    // get the user token from the headers
    let user: User | null = request?.user;
    const dataLoaderContext = createContext(db.sequelize);

    const myContextFunctionData = {
      db,
      dataLoaderContext,
      EXPECTED_OPTIONS_KEY,
      user,
      websocketServer: fastify?.websocketServer,
    };

    // Allow if introspection query only
    if (!Array.isArray(request.body) && request?.body?.query?.includes('IntrospectionQuery')) {
      return myContextFunctionData;
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

    return myContextFunctionData;
  };

  fastify.post(
    '/graphql',
    fastifyApolloHandler(apollo, {
      context: myContextFunction,
    })
  );
};
