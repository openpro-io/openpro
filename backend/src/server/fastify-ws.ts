import { fastifyWebsocket } from '@fastify/websocket';
import axios from 'axios';
import type { FastifyInstance } from 'fastify';
import processRequest from 'graphql-upload/processRequest.mjs';
import { GraphQLError } from 'graphql/error';
import { nanoid } from 'nanoid';

import db from '../db/index.js';
import {
  ALLOW_LOGIN_DOMAINS_LIST,
  ALLOW_LOGIN_EMAILS_LIST,
  ALLOW_SIGNUP,
  FRONTEND_HOSTNAME,
} from '../services/config.js';
import * as wsServer from '../services/ws-server.js';
import type { requestGeneric } from '../typings.js';

export const fastifyWsHandler = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyWebsocket, {
    options: { maxPayload: 1048576, clientTracking: true },
  });

  // TODO: Avoid multiple side effects in single prevalidation hook
  // TODO: This is mostly duplicated from apollo.ts. Lets refactor this to be DRY
  fastify.addHook<requestGeneric>('preValidation', async (request, reply) => {
    // This is for apollo file uploading
    // https://github.com/jaydenseric/graphql-upload
    if (request?.isMultipart) {
      request.body = await processRequest(request.raw, reply.raw);
    }

    // check if the request is authenticated
    // TODO: Refactor to make this cleaner
    if (request.headers.connection === 'Upgrade' && request.url === '/ws') {
      const token = request.headers['sec-websocket-protocol'].split(',').map((x) => x.trim())[1];
      let user = null;

      try {
        // TODO: maybe we just call the url of the caller origin
        const { data } = await axios.get(`${FRONTEND_HOSTNAME}/api/verify-jwt`, {
          headers: { Authorization: `Bearer ${token}` },
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

    fastify.get('/ws', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
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
    });
  });
};
