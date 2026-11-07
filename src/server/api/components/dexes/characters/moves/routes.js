import controller from './controller.js'

export default async function dexCharacterMoveRoutes (fastify) {
  fastify.get('/', controller.list)
}
