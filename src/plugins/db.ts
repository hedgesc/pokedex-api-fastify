import fp from 'fastify-plugin'
import { Pool } from 'pg'
import type { FastifyInstance } from 'fastify'
import config from '../config.js'

declare module 'fastify' {
  interface FastifyInstance {
    db: Pool
  }
}

async function dbPlugin (fastify: FastifyInstance) {
  const pool = new Pool(config.db)
  fastify.decorate('db', pool)
  fastify.addHook('onClose', async () => {
    await pool.end()
  })
}

export default fp(dbPlugin)
