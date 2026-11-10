import type { Pool } from 'pg'
import type { DexCharacterMove } from '../../models.js'
import { asInt } from '../../parse.js'

export function createDexCharacterMoveStore (db: Pool) {
  const list = async (dexId: number, characterId: number) => {
    const sql = 'SELECT * FROM dexes_characters_moves dcg \
    JOIN moves m ON dcg.move_id = m.move_id \
    WHERE dcg.dex_id = $1 AND dcg.character_id = $2 \
    ORDER BY dcg.is_suggested DESC'
    const res = await db.query<DexCharacterMove>(sql, [dexId, characterId])
    return res.rows
  }

  return { list }
}

export function createDexCharacterMoveService (db: Pool) {
  const store = createDexCharacterMoveStore(db)

  const list = async (dexId: number, characterId: number) => {
    return await store.list(asInt(dexId), asInt(characterId))
  }

  return { list }
}
