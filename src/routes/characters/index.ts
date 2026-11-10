import type { FastifyInstance, FastifyReply } from 'fastify'
import { createCharacterService } from './service.js'
import { schemas } from '../../schemas.js'
import type { CharacterWrite, IdParams, PageQuery } from '../../models.js'

const resource = 'Character'

function notFound (reply: FastifyReply) {
  reply.code(404).send({ error: 'Not found' })
}

function text (reply: FastifyReply, statusCode: number, message: string) {
  reply.type('text/plain').code(statusCode).send(message)
}

export default async function characterRoutes (fastify: FastifyInstance) {
  const service = createCharacterService(fastify.db)

  fastify.get<{ Querystring: PageQuery }>('/', { schema: schemas.characterList }, async (request, reply) => {
    const result = await service.list(request.query.limit, request.query.offset)
    reply.code(200).send(result)
  })

  fastify.post<{ Body: CharacterWrite }>('/', { schema: schemas.characterCreate }, async (request, reply) => {
    const result = await service.create(request.body)
    text(reply, 201, `${resource} ${result.id} created`)
  })

  fastify.get<{ Params: IdParams }>('/:id', { schema: schemas.characterGet }, async (request, reply) => {
    const json = await service.get(request.params.id)
    if (!json) {
      notFound(reply)
      return
    }
    reply.code(200).send(json)
  })

  fastify.put<{ Params: IdParams, Body: CharacterWrite }>('/:id', { schema: schemas.characterUpdate }, async (request, reply) => {
    const result = await service.update(request.params.id, request.body)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} updated`)
  })

  fastify.delete<{ Params: IdParams }>('/:id', { schema: schemas.characterRemove }, async (request, reply) => {
    const result = await service.remove(request.params.id)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} deleted`)
  })
}
