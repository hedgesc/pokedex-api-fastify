import { createMoveStore } from './store.js'

export function createMoveService (db) {
  const store = createMoveStore(db)

  const create = async (model) => {
    const row = await store.create(model)
    return { id: row.move_id }
  }

  const get = async (id) => {
    return await store.get(parseInt(id))
  }

  const remove = async (id) => {
    const result = await store.remove(parseInt(id))
    if (result == null) return null
    return { id: result }
  }

  const list = async (limit, offset) => {
    if (limit === undefined && offset === undefined) {
      return store.list()
    }
    return store.page(parseInt(limit) || 10, parseInt(offset) || 0)
  }

  const update = async (id, model) => {
    const result = await store.update(parseInt(id), model)
    if (result == null) return null
    return { id: result }
  }

  return { create, get, remove, list, update }
}
