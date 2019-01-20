const storage = require('node-persist')
const store = storage.create({ dir: 'azsync' })

module.exports.put = async (key, value) => {
  await store.init()
  await store.setItem(key, JSON.stringify(value))
}

module.exports.get = async key => {
  await store.init()
  const value = await store.getItem(key)
  if (!value) return null
  return JSON.parse(value)
}
