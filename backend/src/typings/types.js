/**
 * @typedef User
 * @property {string} id
 */

/**
 * @typedef {import('fastify').FastifyRequest} FastifyRequest
 */

/**
 * @typedef {import('fastify').RequestGenericInterface} RequestGenericInterface
 */

/**
 * @typedef {import('fastify').FastifyInstance} FastifyInstance
 */

/**
 * @typedef {import('fastify').FastifyReply} FastifyReply
 */

/**
 * @typedef {RequestGenericInterface & FastifyRequest & {user: User}} fastifyGenericRequest
 */

export {};
