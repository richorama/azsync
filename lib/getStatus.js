const remotes = require('./remotes')
const discoverLocalFiles = require('./discoverLocalFiles')
const Azure = require('./azure')
const sorter = require('./sorter')
const colour = require('./colour')

function write(text){
  process.stdout.write(text);
}

module.exports = async (local, remoteName, container) => {
  const remote = await remotes.get(remoteName)
  if (!remote) throw new Error(`remote ${remoteName} not found`)

  write('Reading local files ')
  const localFiles = discoverLocalFiles(local)
  write(`${colour('✓', colour.green)} ${localFiles.length} found\n`)

  const azure = Azure(remote)
  write('Reading remote files ')
  await azure.createContainer(container)
  const remoteFiles = await azure.discoverFiles(container)
  write(`${colour('✓', colour.green)} ${remoteFiles.length} found\n\n`)

  const result = sorter(localFiles, remoteFiles)
  return {
    ...result,
    azure
  }
}