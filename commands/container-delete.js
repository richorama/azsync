const commandLineArgs = require('command-line-args')
const validate = require('../lib/validate')
const azure = require('../lib/azure')
const remotes = require('../lib/remotes')

const definitions = [
  { name: 'remote', defaultOption: true },
  { name: 'container' }
]

module.exports = argv => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })

  const remote = options.remote
  const [container] = options._unknown || []

  if (!validate(remote)) return console.log('please supply a remote')
  if (!validate(container)) return console.log('please supply a container name')

  deleteContainer(remote, container)
    .then(() => {})
    .catch(err => {
      console.log(err)
    })
}

async function deleteContainer(remoteName, containerName) {
  const remote = await remotes.get(remoteName)
  if (!remote) throw new Error('remote not found')
  await azure(remote).deleteContainer(containerName)
  console.log(`Deleted container ${containerName}`)
}
