import service from './service.js'

const resource = 'Character'

const notFound = (reply) => {
  reply.code(404).send({ error: 'Not found' })
}

const list = async (request, reply) => {
  const result = await service.list(request.query.limit, request.query.offset)
  reply.code(200).send(result)
}

const get = async (request, reply) => {
  const json = await service.get(request.params.id)
  if (!json) {
    notFound(reply)
    return
  }
  reply.code(200).send(json)
}

const create = async (request, reply) => {
  const result = await service.create(request.body)
  reply.type('text/plain').code(201).send(`${resource} ${result.id} created`)
}

const update = async (request, reply) => {
  const result = await service.update(request.params.id, request.body)
  if (!result) {
    notFound(reply)
    return
  }
  reply.type('text/plain').code(200).send(`${resource} ${result.id} updated`)
}

const remove = async (request, reply) => {
  const result = await service.remove(request.params.id)
  if (!result) {
    notFound(reply)
    return
  }
  reply.type('text/plain').code(200).send(`${resource} ${result.id} deleted`)
}

export default {
  list,
  create,
  get,
  update,
  remove
}
