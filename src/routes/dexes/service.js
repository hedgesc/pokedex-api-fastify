import { createDexStore } from './store.js'

export function createDexService (db) {
  const store = createDexStore(db)

  const create = async (model) => {
    const row = await store.create(model)
    return { id: row.dex_id }
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
