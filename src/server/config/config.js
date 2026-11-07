const env = process.env.NODE_ENV // 'development' or 'production'

const password = process.env.PGPASSWORD

if (!password) {
  throw new Error('PGPASSWORD environment variable is required')
}

const development = {
  app: {
    "port": 3416
  },
  db: {
    "user": "postgres",
    "password": password,
    "database": "pokemondb",
    "host": "127.0.0.1",
    "port": "5432"
  }
}

const docker = {
  app: {
    "port": 3416
  },
  db: {
    "user": "postgres",
    "password": password,
    "database": "pokemondb",
    "host": "postgres",
    "port": "5432"
  }
}

const production = {
  app: {
    "port": 3416
  },
  db: {
    "user": "postgres",
    "password": password,
    "database": "pokemondb",
    "host": "postgres",
    "port": "5432"
  }
}

const config = {
  development,
  docker,
  production
}

export default config[env]