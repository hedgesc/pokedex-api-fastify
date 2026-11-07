import service from './service.js'

const list = async (request, reply) => {
  const result = await service.list(request.params.dexId, request.params.characterId)
  reply.code(200).send(result)
}

export default {
  list
}
