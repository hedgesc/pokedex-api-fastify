import { createMoveService } from './service.js'
import { schemas } from '../../schemas.js'

const resource = 'Move'

function notFound (reply) {
  reply.code(404).send({ error: 'Not found' })
}

function text (reply, statusCode, message) {
  reply.type('text/plain').code(statusCode).send(message)
}

export default async function moveRoutes (fastify) {
  const service = createMoveService(fastify.db)

  fastify.get('/', { schema: schemas.moveList }, async (request, reply) => {
    reply.code(200).send(await service.list(request.query.limit, request.query.offset))
  })

  fastify.post('/', { schema: schemas.moveCreate }, async (request, reply) => {
    const result = await service.create(request.body)
    text(reply, 201, `${resource} ${result.id} created`)
  })

  fastify.get('/:id', { schema: schemas.moveGet }, async (request, reply) => {
    const json = await service.get(request.params.id)
    if (!json) {
      notFound(reply)
      return
    }
    reply.code(200).send(json)
  })

  fastify.put('/:id', { schema: schemas.moveUpdate }, async (request, reply) => {
    const result = await service.update(request.params.id, request.body)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} updated`)
  })

  fastify.delete('/:id', { schema: schemas.moveRemove }, async (request, reply) => {
    const result = await service.remove(request.params.id)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} deleted`)
  })
}
