import type { FastifyInstance, FastifyReply } from 'fastify'
import { createGameService } from './service.js'
import { schemas } from '../../schemas.js'
import type { GameWrite, IdParams } from '../../models.js'

const resource = 'Game'

function notFound (reply: FastifyReply) {
  reply.code(404).send({ error: 'Not found' })
}

function text (reply: FastifyReply, statusCode: number, message: string) {
  reply.type('text/plain').code(statusCode).send(message)
}

export default async function gameRoutes (fastify: FastifyInstance) {
  const service = createGameService(fastify.db)

  fastify.get('/', { schema: schemas.gameList }, async (request, reply) => {
    reply.code(200).send(await service.list())
  })

  fastify.post<{ Body: GameWrite }>('/', { schema: schemas.gameCreate }, async (request, reply) => {
    const result = await service.create(request.body)
    text(reply, 201, `${resource} ${result.id} created`)
  })

  fastify.get<{ Params: IdParams }>('/:id', { schema: schemas.gameGet }, async (request, reply) => {
    const json = await service.get(request.params.id)
    if (!json) {
      notFound(reply)
      return
    }
    reply.code(200).send(json)
  })

  fastify.put<{ Params: IdParams, Body: GameWrite }>('/:id', { schema: schemas.gameUpdate }, async (request, reply) => {
    const result = await service.update(request.params.id, request.body)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} updated`)
  })

  fastify.delete<{ Params: IdParams }>('/:id', { schema: schemas.gameRemove }, async (request, reply) => {
    const result = await service.remove(request.params.id)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} deleted`)
  })
}
