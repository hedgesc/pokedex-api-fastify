export interface IdParams {
  id: number
}

export interface DexCharacterParams {
  id: number
  characterId: number
}

export interface PageQuery {
  limit?: number
  offset?: number
}

export interface Character {
  character_id: number
  pokemon_id: number | null
  name: string
  name_id: string | null
  hp: number | null
  attack: number | null
  defense: number | null
  speed: number | null
  total: number | null
  special_attack: number | null
  special_defense: number | null
  image_url: string | null
  evolves_from_id: number | null
  gen: number | null
  types: string | null
  abilities: string | null
}

export interface CharacterSummary {
  character_id: number
  name: string
  image_url: string | null
}

export interface CharacterWrite {
  pokemon_id?: number | null
  name?: string
  name_id?: string | null
  hp?: number | null
  attack?: number | null
  defense?: number | null
  speed?: number | null
  total?: number | null
  special_attack?: number | null
  special_defense?: number | null
  image_url?: string | null
  evolves_from_id?: number | null
  gen?: number | null
  types?: string | null
  abilities?: string | null
}

export interface CharacterPage {
  items: Character[]
  total_count: number
  has_more: boolean
}

export interface Dex {
  dex_id: number
  name_id: string | null
  name: string
  alternate_name: string | null
  gen: number | null
}

export interface DexWrite {
  name_id?: string | null
  name?: string
  alternate_name?: string | null
  gen?: number | null
}

export interface Move {
  move_id: number
  name: string
  name_id: string | null
  power: number | null
  accuracy: number | null
  pp: number | null
  type: string | null
  gen: number | null
}

export interface MoveWrite {
  name?: string
  name_id?: string | null
  power?: number | null
  accuracy?: number | null
  pp?: number | null
  type?: string | null
  gen?: number | null
}

export interface MovePage {
  items: Move[]
  total_count: number
  has_more: boolean
}

export interface Game {
  game_id: number
  dex_id: number | null
  name: string
  name_id: string | null
  regions: string | null
}

export interface GameWrite {
  dex_id?: number | null
  name?: string
  name_id?: string | null
  regions?: string | null
}

export interface DexCharacterMove {
  dex_id: number
  character_id: number
  move_id: number
  is_suggested: boolean | null
  name: string
  name_id: string | null
  power: number | null
  accuracy: number | null
  pp: number | null
  type: string | null
  gen: number | null
}
