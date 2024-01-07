import { fastifyWebsocket } from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';

import * as wsServer from '../services/ws-server.js';

export const fastifyWsHandler = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyWebsocket, {
    options: { maxPayload: 1048576, clientTracking: true },
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
