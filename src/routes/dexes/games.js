export function createDexGameStore (db) {
  const list = async (id) => {
    const sql = 'SELECT * FROM dex_games WHERE dex_id = $1'
    const res = await db.query(sql, [id])
    return res.rows
  }

  return { list }
}

export function createDexGameService (db) {
  const store = createDexGameStore(db)

  const list = async (id) => {
    return await store.list(parseInt(id))
  }

  return { list }
}
