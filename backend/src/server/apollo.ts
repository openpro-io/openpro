import { ApolloServer } from '@apollo/server';
import { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify';
import axios from 'axios';
import type { FastifyInstance } from 'fastify';
import { GraphQLError } from 'graphql/error';

import db from '../db/index.js';
import resolvers from '../resolvers/index.js';
import {
  ALLOW_LOGIN_DOMAINS_LIST,
  ALLOW_LOGIN_EMAILS_LIST,
  ALLOW_SIGNUP,
  FRONTEND_HOSTNAME,
} from '../services/config.js';
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

  // TODO: Lets hoist this up to the top level, and then we can use it in the
  const myContextFunction = async (request: CustomFastifyRequest): Promise<object> => {
    // get the user token from the headers
    const token = request.headers.authorization;
    let user = null;

    if (!token) return { db, user };

    // Allow if introspection query only
    if (!Array.isArray(request.body) && request?.body?.query?.includes('IntrospectionQuery')) {
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

        if (ALLOW_LOGIN_EMAILS_LIST.length > 0 && !ALLOW_LOGIN_EMAILS_LIST.includes(data.email)) {
          throw new GraphQLError('Email is not allowed to login', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }

        if (
          ALLOW_LOGIN_DOMAINS_LIST.length > 0 &&
          !ALLOW_LOGIN_DOMAINS_LIST.includes(data.email.split('@')[1].toLowerCase())
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
};
