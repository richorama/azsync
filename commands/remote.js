const commandLineArgs = require('command-line-args')

const definitions = [{ name: 'name', defaultOption: true }]

const commands = {
  add: require('./remote-add'),
  list: require('./remote-list')
}

module.exports = argv => {
  const options = commandLineArgs(definitions, {
    argv,
    stopAtFirstUnknown: true
  })
  if (commands[options.name]) {
    return commands[options.name](options._unknown || [])
  }
  console.log("add / remove / list")
}
