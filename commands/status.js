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

  status('.', remote, container)
    .then(() => {})
    .catch(err => console.log('error', err))
}

async function status(local, remoteName, container) {
  const remote = await remotes.get(remoteName)
  if (!remote) throw new Error(`remote ${remoteName} not found`)
  const localFiles = discoverLocalFiles(local)
  const azure = Azure(remote)
  const remoteFiles = await azure.discoverFiles(container)

  const sortResult = sorter(localFiles, remoteFiles)

  printSortResult(sortResult)
}

function plural(arr) {
  if (arr.length === 1) return ''
  return 's'
}

// colours: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function printFileList(list, colour) {
  if (list.length === 0) return
  console.log()
  list.forEach(file => console.log(`    \x1b[${colour}m${file.path}\x1b[0m`))
  console.log()
}

function printSortResult(sortResult) {
  /*
  console.log(
    `${sortResult.unmodified.length} unmodified file${plural(
      sortResult.unmodified
    )}`
  )
  printFileList(sortResult.unmodified)
*/
  if (sortResult.modified.length) {
    console.log(
      `${sortResult.modified.length} modified file${plural(
        sortResult.modified
      )}`
    )
    printFileList(sortResult.modified, 33)
  }

  if (sortResult.localOnly.length) {
    console.log(
      `${sortResult.localOnly.length} local file${plural(sortResult.localOnly)}`
    )
    printFileList(sortResult.localOnly, 32)
  }

  if (sortResult.remoteOnly.length) {
    console.log(
      `${sortResult.remoteOnly.length} remote file${plural(
        sortResult.remoteOnly
      )}`
    )
  }
  printFileList(sortResult.remoteOnly, 31)
}
