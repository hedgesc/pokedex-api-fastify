import type { Pool } from 'pg'
import type { Dex, DexWrite } from '../../models.js'

export function createDexStore (db: Pool) {
  const create = async (dex: DexWrite) => {
    const sql = 'INSERT INTO dexes \
    (name_id, name, alternate_name, gen) \
    VALUES ($1, $2, $3, $4) RETURNING dex_id'

    const values = [
      dex.name_id, dex.name, dex.alternate_name, dex.gen
    ]

    const res = await db.query<{ dex_id: number }>(sql, values)
    const row = res.rows[0]
    if (!row) throw new Error('Insert into dexes did not return a row')
    return row
  }

  const get = async (id: number) => {
    const sql = 'SELECT * FROM dexes WHERE dex_id = $1'
    const res = await db.query<Dex>(sql, [id])
    return res.rows[0]
  }

  const remove = async (id: number) => {
    const sql = 'DELETE FROM dexes WHERE dex_id = $1'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) return null
    return id
  }

  const list = async () => {
    const sql = 'SELECT * FROM dexes ORDER BY gen'
    const res = await db.query<Dex>(sql)
    return res.rows
  }

  const update = async (id: number, dex: DexWrite) => {
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
