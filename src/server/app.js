import path from 'path'
import { fileURLToPath } from 'url'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import config from './config/config.js'
import characterRoutes from './api/components/characters/routes.js'
import dexRoutes from './api/components/dexes/routes.js'
import moveRoutes from './api/components/moves/routes.js'
import gameRoutes from './api/components/games/routes.js'

const openApiPath = fileURLToPath(new URL('../openapi.yaml', import.meta.url))

const app = Fastify({ logger: true })

app.setErrorHandler((err, request, reply) => {
  request.log.error(err)
  if (reply.sent) {
    return
  }
  reply.code(500).send({ error: 'Internal server error' })
})

await app.register(cors, { origin: '*' })
await app.register(formbody)
await app.register(swagger, {
  mode: 'static',
  specification: {
    path: openApiPath,
    baseDir: path.dirname(openApiPath)
  }
})
await app.register(swaggerUi, { routePrefix: '/api-docs' })

await app.register(characterRoutes, { prefix: '/api/v1/characters' })
await app.register(dexRoutes, { prefix: '/api/v1/dexes' })
await app.register(moveRoutes, { prefix: '/api/v1/moves' })
await app.register(gameRoutes, { prefix: '/api/v1/games' })

await app.listen({ port: config.app.port, host: '0.0.0.0' })
console.log('Running Pokedex API on port ' + config.app.port)
