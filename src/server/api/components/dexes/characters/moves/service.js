import store from './store.js'

const list = async (dexId, characterId) => {
  return await store.list(parseInt(dexId), parseInt(characterId))
}

export default {
  list
}