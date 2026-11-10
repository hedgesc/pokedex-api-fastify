import type { Pool } from 'pg'
import type { Character, CharacterPage, CharacterSummary, CharacterWrite } from '../../models.js'

type CharacterPageRow = Character & { total_count: string }

export function createCharacterStore (db: Pool) {
  const create = async (character: CharacterWrite) => {
    const sql = 'INSERT INTO characters \
    (pokemon_id, name, name_id, hp, attack, defense, speed, total, \
    special_attack, special_defense, image_url, evolves_from_id, gen, \
    types, abilities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
    $10, $11, $12, $13, $14, $15) RETURNING character_id'

    const values = [
      character.pokemon_id, character.name,
      character.name_id, character.hp, character.attack,
      character.defense, character.speed, character.total,
      character.special_attack, character.special_defense,
      character.image_url, character.evolves_from_id,
      character.gen, character.types, character.abilities
    ]

    const res = await db.query<{ character_id: number }>(sql, values)
    const row = res.rows[0]
    if (!row) throw new Error('Insert into characters did not return a row')
    return row
  }

  const get = async (id: number) => {
    const sql = 'SELECT * FROM characters WHERE character_id = $1'
    const res = await db.query<Character>(sql, [id])
    return res.rows[0]
  }

  const remove = async (id: number) => {
    const sql = 'DELETE FROM characters WHERE character_id = $1'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) return null
    return id
  }

  const list = async () => {
    const sql = 'SELECT character_id, name, image_url FROM characters ORDER BY character_id'
    const results = await db.query<CharacterSummary>(sql)
    return results.rows
  }

  const page = async (limit: number, offset: number): Promise<CharacterPage> => {
    const lastRow = limit + offset
    const sql = 'WITH cte AS (SELECT * FROM characters) \
    SELECT * FROM (TABLE cte ORDER BY character_id ASC LIMIT $1 OFFSET $2) sub \
    RIGHT JOIN (SELECT count(*) FROM cte) c(total_count) ON true;'

    const results = await db.query<CharacterPageRow>(sql, [limit, offset])

    const result: CharacterPage = {
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

  const update = async (id: number, character: CharacterWrite) => {
    const sql = 'UPDATE characters \
    SET name_id = $2, name = $3, hp = $4, attack = $5, defense = $6, \
    special_attack = $7, special_defense = $8, speed = $9, total = $10, \
    image_url = $11, evolves_from_id = $12, gen = $13, types = $14, \
    abilities = $15, pokemon_id = $16 \
    WHERE character_id = $1'

    const values = [
      id, character.name_id, character.name, character.hp,
      character.attack, character.defense, character.special_attack,
      character.special_defense, character.speed, character.total,
      character.image_url, character.evolves_from_id, character.gen,
      character.types, character.abilities, character.pokemon_id
    ]

    const res = await db.query(sql, values)
    if (res.rowCount === 0) return null
    return id
  }

  return { create, get, remove, list, page, update }
}
