const commandLineArgs = require('command-line-args')
const validate = require('../lib/validate')
const ProgressBar = require('progress')
const getStatus = require('../lib/getStatus')
const colour = require('../lib/colour')
const plural = require('../lib/plural')
const prettyBytes = require('pretty-bytes')

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

async function go(local, remoteName, container, prune){
  const sortResult = await getStatus(local, remoteName, container)
  if (sortResult.toUpload.length){
    await pushFiles(container, sortResult)
  }
  if (prune && sortResult.remoteOnly.length){
    await deleteFiles(container, sortResult)
  }
}

async function pushFiles(container, sortResult) {

  const totalBytes = sortResult.toUpload.reduce(
    (total, value) => total + value.size,
    0
  )
  console.log(
    `Uploading ${sortResult.toUpload.length} file${plural(
      sortResult.toUpload
    )} (${prettyBytes(totalBytes)})`
  )

  var bar = new ProgressBar('[:bar] :etas :filename', {
    total: sortResult.toUpload.length,
    complete: colour('=', colour.green),
    incomplete: '.',
    width: 20
  })

  function upload() {
    const file = sortResult.toUpload.pop()
    if (!file) return
    sortResult.azure
      .uploadFile(container, file)
      .then(() => {
        bar.tick({
          filename: file.path
        })
        setImmediate(upload)
      })
      .catch(err => {
        console.log(`ERROR: ${file.path} - ${err}`)
        bar.tick({
          filename: file.path
        })
        setImmediate(upload)
      })
  }

  // use a parallelism of 4
  for (var i = 0; i < 4; i++) upload()
}

async function deleteFiles(container, sortResult) {

  console.log(
    `Deleting ${sortResult.remoteOnly.length} remote file${plural(
      sortResult.remoteOnly
    )}`
  )

  const bar = new ProgressBar('[:bar] :etas :filename', {
    total: sortResult.remoteOnly.length,
    complete: colour('=', colour.green),
    incomplete: '.',
    width: 20
  })

  function deleteFile() {
    const file = sortResult.remoteOnly.pop()
    if (!file) return
    sortResult.azure.deleteFile(container, file).then(() => {
      bar.tick({
        filename: file.path
      })
      setImmediate(deleteFile)
    })
    .catch(err => {
      console.log(`ERROR: ${file.path} - ${err}`)
      bar.tick({
        filename: file.path
      })
      setImmediate(deleteFile)
    })
  }

  // use a parallelism of 4
  for (var i = 0; i < 4; i++) deleteFile()
}