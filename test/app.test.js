import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'
import { buildApp } from '../src/app.js'

describe('pokedex api', () => {
  let app

  before(async () => {
    app = await buildApp({ logger: false })
  })

  after(async () => {
    await app.close()
  })

  test('serves an OpenAPI document generated from the route schemas', async () => {
    const response = await app.inject({ method: 'GET', url: '/api-docs/json' })
    assert.equal(response.statusCode, 200)
    const body = response.json()
    assert.equal(body.info.title, 'Pokedex API')
    assert.ok(body.paths['/api/v1/characters'].get)
    assert.ok(body.paths['/api/v1/characters'].post)
    assert.ok(body.paths['/api/v1/dexes/{id}/characters/{characterId}/moves'].get)
    assert.ok(body.paths['/api/v1/characters/{id}'].get.responses['404'])
    assert.ok(body.paths['/api/v1/games/{id}'].delete.responses['200'])
  })

  test('rejects a non-integer id before querying Postgres', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/characters/nope' })
    assert.equal(response.statusCode, 400)
    assert.equal(typeof response.json().error, 'string')
  })

  test('hides database failures behind the shared error body', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/characters' })
    assert.equal(response.statusCode, 500)
    assert.deepEqual(response.json(), { error: 'Internal server error' })
  })
})
