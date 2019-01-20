const commandLineArgs = require('command-line-args')
const storage = require('../lib/storage')
const REMOTES = 'REMOTES'

const definitions = [
  { name: 'name', defaultOption: true },
  { name: 'connection' }
]

module.exports = argv => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })

  let [name, connection] = options._unknown

  addRemote(name, connection)
    .then(() => console.log('Remote added'))
    .catch(err => console.log('error', err))
}

async function addRemote(name, connection) {
  const remotes = (await storage.get(REMOTES)) || {}
  remotes[name] = {
    connection
  }
  await storage.put(REMOTES, remotes)
}
