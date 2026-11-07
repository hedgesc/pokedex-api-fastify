import store from './store.js'

// const toCamel = (s) => {
//   return s.replace(/([-_][a-z])/ig, ($1) => {
//     return $1.toUpperCase()
//       .replace('-', '')
//       .replace('_', '');
//   });
// }

const create = async (model) => {
  const row = await store.create(model)
  return { id: row.move_id }
}

const get = async (id) => {
  return await store.get(parseInt(id))
}

const remove = async (id) => {
  const result = await store.remove(parseInt(id))
  if (result == null) return null
  return { id: result }
}

const list = async (limit, offset) => {
  let results

  if(!limit && !offset) {
    results = await store.list()
  }
  else {
    limit = parseInt(limit) || 10
    offset = parseInt(offset) || 0
    results = await store.page(limit, offset)
  }
  
  return results
}

const update = async (id, model) => {
  const result = await store.update(parseInt(id), model)
  if (result == null) return null
  return { id: result }
}

export default {
  create,
  get,
  remove,
  list,
  update
}