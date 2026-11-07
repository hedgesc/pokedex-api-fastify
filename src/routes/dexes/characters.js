export function createDexCharacterStore (db) {
  const list = async (id) => {
    const sql = 'SELECT c.* FROM dexes_characters dc \
    JOIN characters c ON dc.character_id = c.character_id \
    WHERE dc.dex_id = $1'
    const res = await db.query(sql, [id])
    return res.rows
  }

  return { list }
}

export function createDexCharacterService (db) {
  const store = createDexCharacterStore(db)

  const list = async (id) => {
    return await store.list(parseInt(id))
  }

  return { list }
}
