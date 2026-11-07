import { createGameStore } from './store.js'

export function createGameService (db) {
  const store = createGameStore(db)

  const create = async (model) => {
    const row = await store.create(model)
    return { id: row.game_id }
  }

  const get = async (id) => {
    return await store.get(parseInt(id))
  }

  const remove = async (id) => {
    const result = await store.remove(parseInt(id))
    if (result == null) return null
    return { id: result }
  }

  const list = async () => {
    return await store.list()
  }

  const update = async (id, model) => {
    const result = await store.update(parseInt(id), model)
    if (result == null) return null
    return { id: result }
  }

  return { create, get, remove, list, update }
}
