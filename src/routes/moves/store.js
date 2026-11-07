import _ from 'lodash'

export function createMoveStore (db) {
  const create = async (move) => {
    const sql = 'INSERT INTO moves \
    (name, name_id, power, accuracy, pp, type, gen) \
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING move_id'

    const values = [
      move.name, move.name_id, move.power, move.accuracy,
      move.pp, move.type, move.gen
    ]

    const res = await db.query(sql, values)
    return res.rows[0]
  }

  const get = async (id) => {
    const sql = 'SELECT * FROM moves WHERE move_id = $1'
    const res = await db.query(sql, [id])
    return res.rows[0]
  }

  const remove = async (id) => {
    const sql = 'DELETE FROM moves WHERE move_id = $1'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) return null
    return id
  }

  const list = async () => {
    const sql = 'SELECT * FROM moves ORDER BY move_id'
    const results = await db.query(sql)
    return results.rows
  }

  const page = async (limit, offset) => {
    const lastRow = limit + offset
    const sql = 'WITH cte AS (SELECT * FROM moves) \
    SELECT * FROM (TABLE cte ORDER BY move_id ASC LIMIT $1 OFFSET $2) sub \
    RIGHT JOIN (SELECT count(*) FROM cte) c(total_count) ON true;'

    const results = await db.query(sql, [limit, offset])

    const result = {
      items: [],
      total_count: 0,
      has_more: false
    }

    if (results.rows.length > 0) {
      result.total_count = parseInt(results.rows[0].total_count)
      result.items = _.map(results.rows, (obj) => { return _.omit(obj, ['total_count']) })
      result.has_more = result.total_count > lastRow
    }

    return result
  }

  const update = async (id, move) => {
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
