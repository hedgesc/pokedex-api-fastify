import type { FastifyInstance, FastifyReply } from 'fastify'
import { createMoveService } from './service.js'
import { schemas } from '../../schemas.js'
import type { IdParams, MoveWrite, PageQuery } from '../../models.js'

const resource = 'Move'

function notFound (reply: FastifyReply) {
  reply.code(404).send({ error: 'Not found' })
}

function text (reply: FastifyReply, statusCode: number, message: string) {
  reply.type('text/plain').code(statusCode).send(message)
}

export default async function moveRoutes (fastify: FastifyInstance) {
  const service = createMoveService(fastify.db)

  fastify.get<{ Querystring: PageQuery }>('/', { schema: schemas.moveList }, async (request, reply) => {
    reply.code(200).send(await service.list(request.query.limit, request.query.offset))
  })

  fastify.post<{ Body: MoveWrite }>('/', { schema: schemas.moveCreate }, async (request, reply) => {
    const result = await service.create(request.body)
    text(reply, 201, `${resource} ${result.id} created`)
  })

  fastify.get<{ Params: IdParams }>('/:id', { schema: schemas.moveGet }, async (request, reply) => {
    const json = await service.get(request.params.id)
    if (!json) {
      notFound(reply)
      return
    }
    reply.code(200).send(json)
  })

  fastify.put<{ Params: IdParams, Body: MoveWrite }>('/:id', { schema: schemas.moveUpdate }, async (request, reply) => {
    const result = await service.update(request.params.id, request.body)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} updated`)
  })

  fastify.delete<{ Params: IdParams }>('/:id', { schema: schemas.moveRemove }, async (request, reply) => {
    const result = await service.remove(request.params.id)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} deleted`)
  })
}
