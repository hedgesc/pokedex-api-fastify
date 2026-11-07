import controller from './controller.js'

export default async function moveRoutes (fastify) {
  fastify.get('/', controller.list)
  fastify.post('/', controller.create)
  fastify.get('/:id', controller.get)
  fastify.put('/:id', controller.update)
  fastify.delete('/:id', controller.remove)
}
