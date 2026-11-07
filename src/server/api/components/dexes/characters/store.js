import { Pool } from 'pg'
import config from '../../../../config/config.js'
import _ from 'lodash'

const pool = new Pool(config.db)

const list = async (id) => {
  const sql = 'SELECT c.* FROM dexes_characters dc \
  JOIN characters c ON dc.character_id = c.character_id \
  WHERE dc.dex_id = $1'
  const res = await pool.query(sql, [id])
  return res.rows
}

export default {
  list
}