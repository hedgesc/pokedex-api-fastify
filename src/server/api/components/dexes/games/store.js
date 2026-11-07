import { Pool } from 'pg'
import config from '../../../../config/config.js'
import _ from 'lodash'

const pool = new Pool(config.db)

const list = async (id) => {
  const sql = 'SELECT * FROM dex_games WHERE dex_id = $1'
  const res = await pool.query(sql, [id])
  return res.rows
}

export default {
  list
}