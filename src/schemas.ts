const nullableInteger = { type: ['integer', 'null'] }
const nullableString = { type: ['string', 'null'] }

export const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' }
  }
}

export const idParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'integer' }
  }
}

export const dexCharacterMoveParams = {
  type: 'object',
  required: ['id', 'characterId'],
  properties: {
    id: { type: 'integer' },
    characterId: { type: 'integer' }
  }
}

export const pageQuery = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 0,
      description: 'Page size. Paging starts when this or offset is present. Defaults to 10 once paging starts.'
    },
    offset: {
      type: 'integer',
      minimum: 0,
      description: 'Rows to skip. Paging starts when this or limit is present. Defaults to 0 once paging starts.'
    }
  }
}

const characterSummary = {
  type: 'object',
  additionalProperties: true,
  properties: {
    character_id: { type: 'integer' },
    name: { type: 'string' },
    image_url: nullableString
  }
}

const character = {
  type: 'object',
  additionalProperties: true,
  properties: {
    character_id: { type: 'integer' },
    pokemon_id: nullableInteger,
    name: { type: 'string' },
    name_id: nullableString,
    hp: nullableInteger,
    attack: nullableInteger,
    defense: nullableInteger,
    speed: nullableInteger,
    total: nullableInteger,
    special_attack: nullableInteger,
    special_defense: nullableInteger,
    image_url: nullableString,
    evolves_from_id: nullableInteger,
    gen: nullableInteger,
    types: nullableString,
    abilities: nullableString
  }
}

export const characterWrite = {
  type: 'object',
  properties: {
    pokemon_id: nullableInteger,
    name: { type: 'string' },
    name_id: nullableString,
    hp: nullableInteger,
    attack: nullableInteger,
    defense: nullableInteger,
    speed: nullableInteger,
    total: nullableInteger,
    special_attack: nullableInteger,
    special_defense: nullableInteger,
    image_url: nullableString,
    evolves_from_id: nullableInteger,
    gen: nullableInteger,
    types: nullableString,
    abilities: nullableString
  }
}

const characterPage = {
  type: 'object',
  additionalProperties: true,
  properties: {
    items: { type: 'array', items: character },
    total_count: { type: 'integer' },
    has_more: { type: 'boolean' }
  }
}

const dex = {
  type: 'object',
  additionalProperties: true,
  properties: {
    dex_id: { type: 'integer' },
    name_id: nullableString,
    name: { type: 'string' },
    alternate_name: nullableString,
    gen: nullableInteger
  }
}

export const dexWrite = {
  type: 'object',
  properties: {
    name_id: nullableString,
    name: { type: 'string' },
    alternate_name: nullableString,
    gen: nullableInteger
  }
}

const move = {
  type: 'object',
  additionalProperties: true,
  properties: {
    move_id: { type: 'integer' },
    name: { type: 'string' },
    name_id: nullableString,
    power: nullableInteger,
    accuracy: nullableInteger,
    pp: nullableInteger,
    type: nullableString,
    gen: nullableInteger
  }
}

export const moveWrite = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    name_id: nullableString,
    power: nullableInteger,
    accuracy: nullableInteger,
    pp: nullableInteger,
    type: nullableString,
    gen: nullableInteger
  }
}

const movePage = {
  type: 'object',
  additionalProperties: true,
  properties: {
    items: { type: 'array', items: move },
    total_count: { type: 'integer' },
    has_more: { type: 'boolean' }
  }
}

const game = {
  type: 'object',
  additionalProperties: true,
  properties: {
    game_id: { type: 'integer' },
    dex_id: nullableInteger,
    name: { type: 'string' },
    name_id: nullableString,
    regions: nullableString
  }
}

export const gameWrite = {
  type: 'object',
  properties: {
    dex_id: nullableInteger,
    name: { type: 'string' },
    name_id: nullableString,
    regions: nullableString
  }
}

const dexCharacterMove = {
  type: 'object',
  additionalProperties: true,
  description: 'Joined dex-character move row. Extra junction columns may be present.',
  properties: {
    dex_id: { type: 'integer' },
    character_id: { type: 'integer' },
    move_id: { type: 'integer' },
    is_suggested: { type: ['boolean', 'null'] },
    name: { type: 'string' },
    name_id: nullableString,
    power: nullableInteger,
    accuracy: nullableInteger,
    pp: nullableInteger,
    type: nullableString,
    gen: nullableInteger
  }
}

const text = { type: 'string' }
const errors = {
  404: errorSchema,
  500: errorSchema
}

export const schemas = {
  characterList: {
    tags: ['Characters'],
    summary: 'List characters',
    querystring: pageQuery,
    response: {
      200: {
        description: 'An array of character summaries when limit and offset are both omitted. A page of full character rows when either is present.',
        oneOf: [
          { type: 'array', items: characterSummary },
          characterPage
        ]
      },
      500: errorSchema
    }
  },
  characterCreate: {
    tags: ['Characters'],
    summary: 'Create a character',
    body: characterWrite,
    response: { 201: text, 500: errorSchema }
  },
  characterGet: {
    tags: ['Characters'],
    summary: 'Get a character',
    params: idParams,
    response: { 200: character, ...errors }
  },
  characterUpdate: {
    tags: ['Characters'],
    summary: 'Update a character',
    params: idParams,
    body: characterWrite,
    response: { 200: text, ...errors }
  },
  characterRemove: {
    tags: ['Characters'],
    summary: 'Delete a character',
    params: idParams,
    response: { 200: text, ...errors }
  },
  dexList: {
    tags: ['Dexes'],
    summary: 'List dexes',
    response: {
      200: { type: 'array', items: dex },
      500: errorSchema
    }
  },
  dexCreate: {
    tags: ['Dexes'],
    summary: 'Create a dex',
    body: dexWrite,
    response: { 201: text, 500: errorSchema }
  },
  dexGet: {
    tags: ['Dexes'],
    summary: 'Get a dex',
    params: idParams,
    response: { 200: dex, ...errors }
  },
  dexUpdate: {
    tags: ['Dexes'],
    summary: 'Update a dex',
    params: idParams,
    body: dexWrite,
    response: { 200: text, ...errors }
  },
  dexRemove: {
    tags: ['Dexes'],
    summary: 'Delete a dex',
    params: idParams,
    response: { 200: text, ...errors }
  },
  dexGames: {
    tags: ['Dexes'],
    summary: 'List games in a dex',
    params: idParams,
    response: {
      200: { type: 'array', items: game },
      500: errorSchema
    }
  },
  dexCharacters: {
    tags: ['Dexes'],
    summary: 'List characters in a dex',
    params: idParams,
    response: {
      200: { type: 'array', items: character },
      500: errorSchema
    }
  },
  dexCharacterMoves: {
    tags: ['Dexes'],
    summary: 'List moves for a character in a dex',
    params: dexCharacterMoveParams,
    response: {
      200: { type: 'array', items: dexCharacterMove },
      500: errorSchema
    }
  },
  moveList: {
    tags: ['Moves'],
    summary: 'List moves',
    querystring: pageQuery,
    response: {
      200: {
        description: 'An array of moves when limit and offset are both omitted. A page object when either is present.',
        oneOf: [
          { type: 'array', items: move },
          movePage
        ]
      },
      500: errorSchema
    }
  },
  moveCreate: {
    tags: ['Moves'],
    summary: 'Create a move',
    body: moveWrite,
    response: { 201: text, 500: errorSchema }
  },
  moveGet: {
    tags: ['Moves'],
    summary: 'Get a move',
    params: idParams,
    response: { 200: move, ...errors }
  },
  moveUpdate: {
    tags: ['Moves'],
    summary: 'Update a move',
    params: idParams,
    body: moveWrite,
    response: { 200: text, ...errors }
  },
  moveRemove: {
    tags: ['Moves'],
    summary: 'Delete a move',
    params: idParams,
    response: { 200: text, ...errors }
  },
  gameList: {
    tags: ['Games'],
    summary: 'List games',
    response: {
      200: { type: 'array', items: game },
      500: errorSchema
    }
  },
  gameCreate: {
    tags: ['Games'],
    summary: 'Create a game',
    body: gameWrite,
    response: { 201: text, 500: errorSchema }
  },
  gameGet: {
    tags: ['Games'],
    summary: 'Get a game',
    params: idParams,
    response: { 200: game, ...errors }
  },
  gameUpdate: {
    tags: ['Games'],
    summary: 'Update a game',
    params: idParams,
    body: gameWrite,
    response: { 200: text, ...errors }
  },
  gameRemove: {
    tags: ['Games'],
    summary: 'Delete a game',
    params: idParams,
    response: { 200: text, ...errors }
  }
}
