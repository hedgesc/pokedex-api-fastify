import dexCharacterMovesRoutes from './moves/routes.js'
import controller from './controller.js'

export default async function dexCharacterRoutes (fastify) {
  fastify.get('/', controller.list)
  await fastify.register(dexCharacterMovesRoutes, { prefix: '/:characterId/moves' })
}
