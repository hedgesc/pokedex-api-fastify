# pokedex-api-fastify
A Node.js 26 Fastify API for pokedex data.

## API documentation
Interactive docs are served at [http://localhost:3416/api-docs](http://localhost:3416/api-docs) while the server is running. The OpenAPI spec is [src/openapi.yaml](src/openapi.yaml).

## configuration
Set `PGPASSWORD` to the Postgres password in the environment before starting the server. Do not commit it.

```
cd src
set PGPASSWORD=your-password
npm run dev
```

## docker
```
docker build src -t pokedex-api-fastify
docker run -e PGPASSWORD=your-password -p 3416:3416 pokedex-api-fastify
```
