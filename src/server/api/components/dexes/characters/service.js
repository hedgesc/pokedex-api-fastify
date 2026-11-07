import store from './store.js'

const list = async (id) => {
  return await store.list(parseInt(id))
}

export default {
  list
}