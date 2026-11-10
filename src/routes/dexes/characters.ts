import type { Pool } from 'pg'
import type { Character } from '../../models.js'
import { asInt } from '../../parse.js'

export function createDexCharacterStore (db: Pool) {
  const list = async (id: number) => {
    const sql = 'SELECT c.* FROM dexes_characters dc \
    JOIN characters c ON dc.character_id = c.character_id \
    WHERE dc.dex_id = $1'
    const res = await db.query<Character>(sql, [id])
    return res.rows
  }

  return { list }
}

export function createDexCharacterService (db: Pool) {
  const store = createDexCharacterStore(db)

  const list = async (id: number) => {
    return await store.list(asInt(id))
  }

  return { list }
}
