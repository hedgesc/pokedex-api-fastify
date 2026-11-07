export function createGameStore (db) {
  const create = async (game) => {
    const sql = 'INSERT INTO dex_games \
    (dex_id, name, name_id, regions) \
    VALUES ($1, $2, $3, $4) RETURNING game_id'

    const values = [
      game.dex_id, game.name, game.name_id, game.regions
    ]

    const res = await db.query(sql, values)
    return res.rows[0]
  }

  const get = async (id) => {
    const sql = 'SELECT * FROM dex_games WHERE game_id = $1'
    const res = await db.query(sql, [id])
    return res.rows[0]
  }

  const remove = async (id) => {
    const sql = 'DELETE FROM dex_games WHERE game_id = $1'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) return null
    return id
  }

  const list = async () => {
    const sql = 'SELECT * FROM dex_games ORDER BY dex_id, game_id'
    const results = await db.query(sql)
    return results.rows
  }

  const update = async (id, game) => {
    const sql = 'UPDATE dex_games \
    SET dex_id = $2, name = $3, name_id = $4, regions = $5 \
    WHERE game_id = $1'

    const values = [
      id, game.dex_id, game.name, game.name_id, game.regions
    ]

    const res = await db.query(sql, values)
    if (res.rowCount === 0) return null
    return id
  }

  return { create, get, remove, list, update }
}
