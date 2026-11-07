import service from './service.js'

const list = async (request, reply) => {
  const result = await service.list(request.params.dexId)
  reply.code(200).send(result)
}

export default {
  list
}
