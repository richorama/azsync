const storage = require('./storage')
const REMOTES = 'REMOTES'
const cookie = require('cookie')

module.exports.get = async name => {
  // if a remote is supplied, rather than a name of one, just return the remote
  const connInfo = cookie.parse(name)
  if (connInfo.AccountName && connInfo.AccountKey) {
    return {
      connection: name
    }
  }

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
