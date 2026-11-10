import Fastify, { type FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import dbPlugin from './plugins/db.js'
import characterRoutes from './routes/characters/index.js'
import dexRoutes from './routes/dexes/index.js'
import moveRoutes from './routes/moves/index.js'
import gameRoutes from './routes/games/index.js'

const description = `REST API for pokedex data. There is no authentication.

List endpoints for characters and moves return a bare array when neither limit nor offset is set. If either query parameter is present, the response is a page object with items, total_count, and has_more. An omitted limit defaults to 10 and an omitted offset defaults to 0 once paging is triggered.

Create, update, and delete success bodies are plain text. Reads return snake_case columns from Postgres.`

interface BuildOptions {
  logger?: FastifyServerOptions['logger']
}

export async function buildApp (options: BuildOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? true
  })

  // Response schemas document the contract for Swagger. Postgres rows can
  // include columns beyond those properties, so serialization passes the
  // value through instead of dropping unknown fields.
  app.setSerializerCompiler(() => {
    return (data) => {
      if (typeof data === 'string') return data
      return JSON.stringify(data)
    }
  })

  app.setErrorHandler((err, request, reply) => {
    const statusCode = typeof err === 'object' && err !== null && 'statusCode' in err && typeof err.statusCode === 'number'
      ? err.statusCode
      : undefined
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      const message = err instanceof Error ? err.message : 'Request failed'
      reply.code(statusCode).send({ error: message })
      return
    }
    request.log.error(err instanceof Error ? err : { err })
    if (reply.sent) return
    reply.code(500).send({ error: 'Internal server error' })
  })

  await app.register(cors, { origin: '*' })
  await app.register(formbody)
  await app.register(dbPlugin)
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Pokedex API',
        version: '1.0.0',
        description
      },
      servers: [{ url: 'http://localhost:3416' }],
      tags: [
        { name: 'Characters' },
        { name: 'Dexes' },
        { name: 'Moves' },
        { name: 'Games' }
      ]
    },
    transform: ({ schema, url }) => {
      const documentedUrl = url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url
      return { schema, url: documentedUrl }
    }
  })
  await app.register(swaggerUi, { routePrefix: '/api-docs' })

  await app.register(characterRoutes, { prefix: '/api/v1/characters' })
  await app.register(dexRoutes, { prefix: '/api/v1/dexes' })
  await app.register(moveRoutes, { prefix: '/api/v1/moves' })
  await app.register(gameRoutes, { prefix: '/api/v1/games' })

  return app
}
