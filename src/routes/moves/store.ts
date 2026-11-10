import type { Pool } from 'pg'
import type { Move, MovePage, MoveWrite } from '../../models.js'

type MovePageRow = Move & { total_count: string }

export function createMoveStore (db: Pool) {
  const create = async (move: MoveWrite) => {
    const sql = 'INSERT INTO moves \
    (name, name_id, power, accuracy, pp, type, gen) \
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING move_id'

    const values = [
      move.name, move.name_id, move.power, move.accuracy,
      move.pp, move.type, move.gen
    ]

    const res = await db.query<{ move_id: number }>(sql, values)
    const row = res.rows[0]
    if (!row) throw new Error('Insert into moves did not return a row')
    return row
  }

  const get = async (id: number) => {
    const sql = 'SELECT * FROM moves WHERE move_id = $1'
    const res = await db.query<Move>(sql, [id])
    return res.rows[0]
  }

  const remove = async (id: number) => {
    const sql = 'DELETE FROM moves WHERE move_id = $1'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) return null
    return id
  }

  const list = async () => {
    const sql = 'SELECT * FROM moves ORDER BY move_id'
    const results = await db.query<Move>(sql)
    return results.rows
  }

  const page = async (limit: number, offset: number): Promise<MovePage> => {
    const lastRow = limit + offset
    const sql = 'WITH cte AS (SELECT * FROM moves) \
    SELECT * FROM (TABLE cte ORDER BY move_id ASC LIMIT $1 OFFSET $2) sub \
    RIGHT JOIN (SELECT count(*) FROM cte) c(total_count) ON true;'

    const results = await db.query<MovePageRow>(sql, [limit, offset])

    const result: MovePage = {
      items: [],
      total_count: 0,
      has_more: false
    }

    const first = results.rows[0]
    if (first) {
      result.total_count = parseInt(first.total_count)
      result.items = results.rows.map(({ total_count, ...item }) => item)
      result.has_more = result.total_count > lastRow
    }

    return result
  }

  const update = async (id: number, move: MoveWrite) => {
    const sql = 'UPDATE moves \
    SET name = $2, name_id = $3, power = $4, accuracy = $5, \
    pp = $6, type = $7, gen = $8 \
    WHERE move_id = $1'

    const values = [
      id, move.name, move.name_id, move.power,
      move.accuracy, move.pp, move.type, move.gen
    ]

    const res = await db.query(sql, values)
    if (res.rowCount === 0) return null
    return id
  }

  return { create, get, remove, list, page, update }
}
