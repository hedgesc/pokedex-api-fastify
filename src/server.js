import { buildApp } from './app.js'
import config from './config.js'

const app = await buildApp()

try {
  await app.listen({ port: config.app.port, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

const shutdown = async () => {
  try {
    await app.close()
  } finally {
    process.exit(0)
  }
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
