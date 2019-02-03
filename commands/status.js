const commandLineArgs = require('command-line-args')
const validate = require('../lib/validate')
const getStatus = require('../lib/getStatus')
const colour = require('../lib/colour')

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
  const sortResult = await getStatus(local, remoteName, container)

  printSortResult(sortResult)
}

function plural(arr) {
  if (arr.length === 1) return ''
  return 's'
}

// colours: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function printFileList(list, c) {
  if (list.length === 0) return
  console.log()
  list.forEach(file => console.log(`    ${colour(file.path, c)}`))
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
    printFileList(sortResult.modified, colour.yellow)
  }

  if (sortResult.localOnly.length) {
    console.log(
      `${sortResult.localOnly.length} local file${plural(sortResult.localOnly)}`
    )
    printFileList(sortResult.localOnly, colour.green)
  }

  if (sortResult.remoteOnly.length) {
    console.log(
      `${sortResult.remoteOnly.length} remote file${plural(
        sortResult.remoteOnly
      )}`
    )
  }
  printFileList(sortResult.remoteOnly, colour.red)
}
