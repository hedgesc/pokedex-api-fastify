import type { Pool } from 'pg'
import type { CharacterWrite } from '../../models.js'
import { asInt, pageArg } from '../../parse.js'
import { createCharacterStore } from './store.js'

export function createCharacterService (db: Pool) {
  const store = createCharacterStore(db)

  const create = async (model: CharacterWrite) => {
    const row = await store.create(model)
    return { id: row.character_id }
  }

  const get = async (id: number) => {
    return await store.get(asInt(id))
  }

  const remove = async (id: number) => {
    const result = await store.remove(asInt(id))
    if (result == null) return null
    return { id: result }
  }

  const list = async (limit?: number, offset?: number) => {
    if (limit === undefined && offset === undefined) {
      return store.list()
    }
    return store.page(pageArg(limit, 10), pageArg(offset, 0))
  }

  const update = async (id: number, model: CharacterWrite) => {
    const result = await store.update(asInt(id), model)
    if (result == null) return null
    return { id: result }
  }

  return { create, get, remove, list, update }
}
