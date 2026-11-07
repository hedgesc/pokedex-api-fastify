import fp from 'fastify-plugin'
import { Pool } from 'pg'
import config from '../config.js'

async function dbPlugin (fastify) {
  const pool = new Pool(config.db)
  fastify.decorate('db', pool)
  fastify.addHook('onClose', async () => {
    await pool.end()
  })
}

export default fp(dbPlugin)
