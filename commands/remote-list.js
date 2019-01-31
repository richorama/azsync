const commandLineArgs = require('command-line-args')
const remotes = require('../lib/remotes')

const definitions = [{ name: 'verbose', alias: 'v', type: Boolean }]

module.exports = argv => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })

  listRemotes(options.verbose)
    .then(() => {})
    .catch(err => console.log('error', err))
}

async function listRemotes(verbose) {
  const list = await remotes.all()
  for (remote in list) {
    console.log(`${remote} ${verbose ? remotes[remote].connection : ''}`)
  }
}
