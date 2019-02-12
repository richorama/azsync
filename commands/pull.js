const commandLineArgs = require('command-line-args')
const validate = require('../lib/validate')
const ProgressBar = require('progress')
const getStatus = require('../lib/getStatus')
const colour = require('../lib/colour')
const plural = require('../lib/plural')
const fs = require('fs')

const definitions = [
  { name: 'prune', alias: 'p', type: Boolean },
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

  go('.', remote, container, options.prune)
    .then(() => {})
    .catch(err => console.log('error', err))
}

async function go(local, remoteName, container, prune) {
  const sortResult = await getStatus(local, remoteName, container)
  if (sortResult.toDownload.length) {
    await pullFiles(container, sortResult)
  }
  if (prune && sortResult.localOnly.length) {
    await deleteFiles(sortResult)
  }
}

async function pullFiles(container, sortResult) {
  const totalBytes = sortResult.toDownload.reduce(
    (total, value) => total + value.size,
    0
  )
  console.log(
    `Downloading ${sortResult.toDownload.length} files (${prettyBytes(
      totalBytes
    )})`
  )

  var bar = new ProgressBar('[:bar] :etas :filename', {
    total: sortResult.toDownload.length,
    complete: colour('=', colour.green),
    incomplete: '.',
    width: 20
  })

  function download() {
    const file = sortResult.toDownload.pop()
    if (!file) return
    sortResult.azure
      .downloadFile(container, file)
      .then(() => {
        bar.tick({
          filename: file.path
        })
        setImmediate(download)
      })
      .catch(err => {
        console.log(`ERROR: ${file.path} - ${err}`)
        bar.tick({
          filename: file.path
        })
        setImmediate(download)
      })
  }

  // use a parallelism of 4
  for (var i = 0; i < 4; i++) download()
}

function deleteFiles(sortResult) {
  console.log(
    `Deleting ${sortResult.localOnly.length} local file${plural(
      sortResult.localOnly
    )}`
  )

  const bar = new ProgressBar('[:bar] :etas :filename', {
    total: sortResult.localOnly.length,
    complete: colour('=', colour.green),
    incomplete: '.',
    width: 20
  })

  for (const file in sortResult.localOnly) {
    fs.unlinkSync(file.path)
    bar.tick({ filename: file.path })
  }
}
