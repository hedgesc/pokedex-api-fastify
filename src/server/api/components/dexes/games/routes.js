import controller from './controller.js'

export default async function dexGameRoutes (fastify) {
  fastify.get('/', controller.list)
}
