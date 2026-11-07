import { createGameService } from './service.js'
import { schemas } from '../../schemas.js'

const resource = 'Game'

function notFound (reply) {
  reply.code(404).send({ error: 'Not found' })
}

function text (reply, statusCode, message) {
  reply.type('text/plain').code(statusCode).send(message)
}

export default async function gameRoutes (fastify) {
  const service = createGameService(fastify.db)

  fastify.get('/', { schema: schemas.gameList }, async (request, reply) => {
    reply.code(200).send(await service.list())
  })

  fastify.post('/', { schema: schemas.gameCreate }, async (request, reply) => {
    const result = await service.create(request.body)
    text(reply, 201, `${resource} ${result.id} created`)
  })

  fastify.get('/:id', { schema: schemas.gameGet }, async (request, reply) => {
    const json = await service.get(request.params.id)
    if (!json) {
      notFound(reply)
      return
    }
    reply.code(200).send(json)
  })

  fastify.put('/:id', { schema: schemas.gameUpdate }, async (request, reply) => {
    const result = await service.update(request.params.id, request.body)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} updated`)
  })

  fastify.delete('/:id', { schema: schemas.gameRemove }, async (request, reply) => {
    const result = await service.remove(request.params.id)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} deleted`)
  })
}
