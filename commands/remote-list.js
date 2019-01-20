const commandLineArgs = require('command-line-args')
const storage = require('../lib/storage')
const REMOTES = 'REMOTES'
const validate = require('../lib/validate')

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
  const remotes = (await storage.get(REMOTES)) || {}
  for (remote in remotes) {
    console.log(`${remote} ${verbose ? remotes[remote].connection : ''}`)
  }
}
