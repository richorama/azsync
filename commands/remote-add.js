const commandLineArgs = require('command-line-args')
const storage = require('../lib/storage')
const REMOTES = 'REMOTES'
const validate = require('../lib/validate')

const definitions = [
  { name: 'name', defaultOption: true },
  { name: 'connection' }
]

module.exports = argv => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })

  const name = options.name
  const [connection] = options._unknown || []

  if (!validate(name)) return console.log('please supply a name for the remote')
  if (!validate(connection))
    return console.log('please supply a connection string for the remote')

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
