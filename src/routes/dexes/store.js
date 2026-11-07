export function createDexStore (db) {
  const create = async (dex) => {
    const sql = 'INSERT INTO dexes \
    (name_id, name, alternate_name, gen) \
    VALUES ($1, $2, $3, $4) RETURNING dex_id'

    const values = [
      dex.name_id, dex.name, dex.alternate_name, dex.gen
    ]

    const res = await db.query(sql, values)
    return res.rows[0]
  }

  const get = async (id) => {
    const sql = 'SELECT * FROM dexes WHERE dex_id = $1'
    const res = await db.query(sql, [id])
    return res.rows[0]
  }

  const remove = async (id) => {
    const sql = 'DELETE FROM dexes WHERE dex_id = $1'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) return null
    return id
  }

  const list = async () => {
    const sql = 'SELECT * FROM dexes ORDER BY gen'
    const res = await db.query(sql)
    return res.rows
  }

  const update = async (id, dex) => {
    const sql = 'UPDATE dexes \
    SET name_id = $2, name = $3, alternate_name = $4, gen = $5 \
    WHERE dex_id = $1'

    const values = [
      id, dex.name_id, dex.name,
      dex.alternate_name, dex.gen
    ]

    const res = await db.query(sql, values)
    if (res.rowCount === 0) return null
    return id
  }

  return { create, get, remove, list, update }
}
