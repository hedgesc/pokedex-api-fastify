export function createDexCharacterMoveStore (db) {
  const list = async (dexId, characterId) => {
    const sql = 'SELECT * FROM dexes_characters_moves dcg \
    JOIN moves m ON dcg.move_id = m.move_id \
    WHERE dcg.dex_id = $1 AND dcg.character_id = $2 \
    ORDER BY dcg.is_suggested DESC'
    const res = await db.query(sql, [dexId, characterId])
    return res.rows
  }

  return { list }
}

export function createDexCharacterMoveService (db) {
  const store = createDexCharacterMoveStore(db)

  const list = async (dexId, characterId) => {
    return await store.list(parseInt(dexId), parseInt(characterId))
  }

  return { list }
}
