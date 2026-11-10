import type { Pool } from 'pg'
import type { Game } from '../../models.js'
import { asInt } from '../../parse.js'

export function createDexGameStore (db: Pool) {
  const list = async (id: number) => {
    const sql = 'SELECT * FROM dex_games WHERE dex_id = $1'
    const res = await db.query<Game>(sql, [id])
    return res.rows
  }

  return { list }
}

export function createDexGameService (db: Pool) {
  const store = createDexGameStore(db)

  const list = async (id: number) => {
    return await store.list(asInt(id))
  }

  return { list }
}
