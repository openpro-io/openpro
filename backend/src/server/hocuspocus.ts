import type { FastifyInstance } from 'fastify';

import hocuspocusServer from '../services/hocuspocus-server.js';

export const hocuspocusHandler = async (fastify: FastifyInstance) => {
  await fastify.register(async function (fastify) {
    fastify.get('/collaboration', { websocket: true }, (connection, req) => {
      const context = {};

      // @ts-ignore
      hocuspocusServer.handleConnection(connection.socket, req, context);
    });
  });
};
