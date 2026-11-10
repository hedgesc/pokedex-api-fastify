import type { PoolConfig } from 'pg'

const env = process.env.NODE_ENV
const password = process.env.PGPASSWORD

if (!password) {
  throw new Error('PGPASSWORD environment variable is required')
}

interface Config {
  app: {
    port: number
  }
  db: PoolConfig
}

const development: Config = {
  app: {
    port: 3416
  },
  db: {
    user: 'postgres',
    password,
    database: 'pokemondb',
    host: '127.0.0.1',
    port: 5432
  }
}

const docker: Config = {
  app: {
    port: 3416
  },
  db: {
    user: 'postgres',
    password,
    database: 'pokemondb',
    host: 'postgres',
    port: 5432
  }
}

const production: Config = {
  app: {
    port: 3416
  },
  db: {
    user: 'postgres',
    password,
    database: 'pokemondb',
    host: 'postgres',
    port: 5432
  }
}

const configs: Record<string, Config> = {
  development,
  docker,
  production
}

function loadConfig (): Config {
  const selected = env ? configs[env] : undefined
  if (!selected) {
    throw new Error('NODE_ENV must be development, docker, or production')
  }
  return selected
}

export default loadConfig()
