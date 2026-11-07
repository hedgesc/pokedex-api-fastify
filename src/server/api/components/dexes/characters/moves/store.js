import { Pool } from 'pg'
import config from '../../../../../config/config.js'
import _ from 'lodash'

const pool = new Pool(config.db)

const list = async (dexId, characterId) => {
  const sql = 'SELECT * FROM dexes_characters_moves dcg \
  JOIN moves m ON dcg.move_id = m.move_id \
  WHERE dcg.dex_id = $1 AND dcg.character_id = $2 \
  ORDER BY dcg.is_suggested DESC'
  const res = await pool.query(sql, [dexId, characterId])
  return res.rows
}

export default {
  list
}