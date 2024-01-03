import fastify from './server/index.js';
import { HTTP_PORT } from './services/config.js';

await fastify.listen({ port: Number(HTTP_PORT), host: '0.0.0.0' });

console.log(`server listening on ${HTTP_PORT}`);
