const commandLineArgs = require('command-line-args')
const validate = require('../lib/validate')
const azure = require('../lib/azure')
const remotes = require('../lib/remotes')

const definitions = [{ name: 'remote', defaultOption: true }]

module.exports = argv => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })
  const remote = options.remote

  if (!validate(remote)) return console.log('please supply a remote')

  listContainers(remote)
    .then(() => {})
    .catch(err => {
      console.log(err)
    })
}

async function listContainers(remoteName) {
  const remote = await remotes.get(remoteName)
  if (!remote) throw new Error("remote not found")
  const result = await azure(remote).listContainers()
  result.forEach(container => {
    console.log(container.name)
  })
}
