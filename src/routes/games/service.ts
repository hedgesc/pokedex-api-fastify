import type { Pool } from 'pg'
import type { GameWrite } from '../../models.js'
import { asInt } from '../../parse.js'
import { createGameStore } from './store.js'

export function createGameService (db: Pool) {
  const store = createGameStore(db)

  const create = async (model: GameWrite) => {
    const row = await store.create(model)
    return { id: row.game_id }
  }

  const get = async (id: number) => {
    return await store.get(asInt(id))
  }

  const remove = async (id: number) => {
    const result = await store.remove(asInt(id))
    if (result == null) return null
    return { id: result }
  }

  const list = async () => {
    return await store.list()
  }

  const update = async (id: number, model: GameWrite) => {
    const result = await store.update(asInt(id), model)
    if (result == null) return null
    return { id: result }
  }

  return { create, get, remove, list, update }
}
