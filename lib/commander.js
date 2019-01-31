const commandLineArgs = require('command-line-args')

const definitions = [{ name: 'name', defaultOption: true }]

module.exports = (commands, argv) => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })
  if (commands[options.name]) {
    return commands[options.name](options._unknown || [])
  }
  console.log(`Please supply a command (${Object.keys(commands).join(' / ')})`)
  return false
}
