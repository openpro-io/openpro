import { fastifyWebsocket } from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';
import type { WebSocket } from 'ws';

import * as wsServer from '../services/ws-server.js';

interface MyWebSocket extends WebSocket {
  isAlive?: boolean;
  id?: string;
  user?: any;
  namespace?: string;
}

const wsPlugin = async (instance: FastifyInstance) => {
  instance.websocketServer.on('connection', function connection(ws: MyWebSocket) {
    ws.isAlive = true;

    // Heartbeat
    ws.on('message', function (message) {
      const msg = message.toString();
      if (['ping', 'pong'].includes(msg)) {
        ws.isAlive = true;
        ws.send(msg === 'ping' ? 'pong' : 'ping');
      }
    });
  });

  const interval = setInterval(function ping() {
    instance.websocketServer.clients.forEach(function each(ws: MyWebSocket) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
    });
  }, 30000);

  instance.websocketServer.on('close', function close() {
    clearInterval(interval);
  });

  instance.get('/ws', { websocket: true }, (connection, req) => {
    const context = {};

    const clients = instance.websocketServer.clients;

    const handleConnectionSocket: MyWebSocket = connection.socket;
    handleConnectionSocket.id = nanoid();
    handleConnectionSocket.user = req?.user;
    handleConnectionSocket.namespace = 'ws';

    wsServer.handleConnection({
      socket: handleConnectionSocket,
      req,
      context,
      clients,
    });
  });
};

export const fastifyWsHandler = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyWebsocket, {
    options: { maxPayload: 1048576, clientTracking: true },
  });

  await fastify.register(wsPlugin);
};
