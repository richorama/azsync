const commandLineArgs = require('command-line-args')
const validate = require('../lib/validate')
const ProgressBar = require('progress')
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

  pull('.', remote, container)
    .then(() => {})
    .catch(err => console.log('error', err))
}

async function pull(local, remoteName, container) {
  const sortResult = await getStatus(local, remoteName, container)

  const totalBytes = sortResult.toDownload.reduce((total, value) => total + value.size, 0)
  console.log(`Downloading ${sortResult.toDownload.length} files (${totalBytes} bytes)`)

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
