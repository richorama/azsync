const commandLineArgs = require('command-line-args')
const remotes = require('../lib/remotes')
const validate = require('../lib/validate')
const discoverLocalFiles = require('../lib/discoverLocalFiles')
const Azure = require('../lib/azure')
const sorter = require('../lib/sorter')

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

  push('.', remote, container)
    .then(() => {})
    .catch(err => console.log('error', err))
}

async function push(local, remoteName, container) {
  const remote = await remotes.get(remoteName)
  if (!remote) throw new Error(`remote ${remoteName} not found`)

  const localFiles = discoverLocalFiles(local)

  const azure = Azure(remote)
  await azure.createContainer(container)
  const remoteFiles = await azure.discoverFiles(container)

  sortResult = sorter(localFiles, remoteFiles)


  for (var i = 0; i < sortResult.toUpload.length; i++) {
    var file = sortResult.toUpload[i]
    console.log('Uploading ', file.path)
    await azure.uploadFile(container, file)
  }
}
