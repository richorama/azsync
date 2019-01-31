const storage = require('./storage')
const REMOTES = 'REMOTES'

module.exports.get = async name => {
  const remotes = (await storage.get(REMOTES)) || {}
  return remotes[name]
}

module.exports.put = async (name, remote) => {
  const remotes = (await storage.get(REMOTES)) || {}
  remotes[name] = remote
  await storage.put(REMOTES, remotes)
}

module.exports.all = async () => {
  return (await storage.get(REMOTES)) || {}
}
