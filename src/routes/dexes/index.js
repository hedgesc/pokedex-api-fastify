import { createDexService } from './service.js'
import { createDexGameService } from './games.js'
import { createDexCharacterService } from './characters.js'
import { createDexCharacterMoveService } from './moves.js'
import { schemas } from '../../schemas.js'

const resource = 'Dex'

function notFound (reply) {
  reply.code(404).send({ error: 'Not found' })
}

function text (reply, statusCode, message) {
  reply.type('text/plain').code(statusCode).send(message)
}

export default async function dexRoutes (fastify) {
  const service = createDexService(fastify.db)

  fastify.get('/', { schema: schemas.dexList }, async (request, reply) => {
    reply.code(200).send(await service.list())
  })

  fastify.post('/', { schema: schemas.dexCreate }, async (request, reply) => {
    const result = await service.create(request.body)
    text(reply, 201, `${resource} ${result.id} created`)
  })

  fastify.get('/:id', { schema: schemas.dexGet }, async (request, reply) => {
    const json = await service.get(request.params.id)
    if (!json) {
      notFound(reply)
      return
    }
    reply.code(200).send(json)
  })

  fastify.put('/:id', { schema: schemas.dexUpdate }, async (request, reply) => {
    const result = await service.update(request.params.id, request.body)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} updated`)
  })

  fastify.delete('/:id', { schema: schemas.dexRemove }, async (request, reply) => {
    const result = await service.remove(request.params.id)
    if (!result) {
      notFound(reply)
      return
    }
    text(reply, 200, `${resource} ${result.id} deleted`)
  })

  await fastify.register(async function dexGames (child) {
    const games = createDexGameService(child.db)
    child.get('/', { schema: schemas.dexGames }, async (request, reply) => {
      reply.code(200).send(await games.list(request.params.id))
    })
  }, { prefix: '/:id/games' })

  await fastify.register(async function dexCharacters (child) {
    const characters = createDexCharacterService(child.db)
    child.get('/', { schema: schemas.dexCharacters }, async (request, reply) => {
      reply.code(200).send(await characters.list(request.params.id))
    })

    await child.register(async function dexCharacterMoves (grandchild) {
      const moves = createDexCharacterMoveService(grandchild.db)
      grandchild.get('/', { schema: schemas.dexCharacterMoves }, async (request, reply) => {
        const result = await moves.list(request.params.id, request.params.characterId)
        reply.code(200).send(result)
      })
    }, { prefix: '/:characterId/moves' })
  }, { prefix: '/:id/characters' })
}
