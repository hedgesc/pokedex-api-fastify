import dexGamesRoutes from './games/routes.js'
import dexCharactersRoutes from './characters/routes.js'
import controller from './controller.js'

export default async function dexRoutes (fastify) {
  fastify.get('/', controller.list)
  fastify.post('/', controller.create)
  fastify.get('/:id', controller.get)
  fastify.put('/:id', controller.update)
  fastify.delete('/:id', controller.remove)

  await fastify.register(dexGamesRoutes, { prefix: '/:dexId/games' })
  await fastify.register(dexCharactersRoutes, { prefix: '/:dexId/characters' })
}
