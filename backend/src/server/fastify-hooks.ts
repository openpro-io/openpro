import axios from 'axios';
import * as console from 'console';
import { FastifyInstance, type FastifyReply } from 'fastify';
import { GraphQLError } from 'graphql';
import processRequest from 'graphql-upload/processRequest.mjs';

import db from '../db/index.js';
import { cache } from '../services/cache.js';
import {
  ALLOW_LOGIN_DOMAINS_LIST,
  ALLOW_LOGIN_EMAILS_LIST,
  ALLOW_SIGNUP,
  FRONTEND_HOSTNAME,
} from '../services/config.js';
import { hash } from '../services/utils.js';
import type { CustomFastifyRequest, requestGeneric } from '../typings.js';

const addUserToRequest = async (request: CustomFastifyRequest, reply: FastifyReply) => {
  let token = null;
  let user = null;

  if (request.headers.authorization) {
    token = request.headers.authorization;
  } else if (request.headers['sec-websocket-protocol']) {
    token = 'Bearer ' + request.headers['sec-websocket-protocol'].split(',').map((x) => x.trim())[1];
  }

  // Downstream services can use this to check if the user is authenticated.
  // They are responsible for checking the user permissions.
  if (!token) return;

  const cacheKey = hash(token);

  const cachedUser = cache.get(cacheKey);

  if (cachedUser) {
    request.user = db.User.build(cachedUser);
    return;
  }

  try {
    // TODO: maybe we just call the url of the caller origin
    const { data } = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
      headers: { Authorization: token },
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

    user = await db.User.findOne({
      where: { externalId },
    });

    if (!user && ALLOW_SIGNUP) {
      try {
        const [firstName, lastName] = data.name.split(' ');

        user = await db.User.create({
          email: data.email,
          externalId,
          firstName,
          lastName,
        });
      } catch (e) {}
    }

    // A few seconds is enough to see performance gains as most operations are bursty
    cache.set(cacheKey, user, 5);

    // !! Modify the request object
    request.user = user;
  } catch (e) {
    if (e?.response?.status === 401) {
      reply.code(401).send({ error: 'not authenticated' });
    } else {
      // TODO: We should probably throw a 500 here and log the error
      console.error({ e });
    }
  }
};

export const fastifyHooksHandler = async (fastify: FastifyInstance) => {
  fastify.addHook<requestGeneric>('preValidation', async (request, reply) => {
    // This is for apollo file uploading
    // https://github.com/jaydenseric/graphql-upload
    if (request?.isMultipart) {
      request.body = await processRequest(request.raw, reply.raw);
    }

    await addUserToRequest(request as CustomFastifyRequest, reply);
  });
};
