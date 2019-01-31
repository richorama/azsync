const commandLineArgs = require('command-line-args')
const mainDefinitions = [{ name: 'name', defaultOption: true }]
const mainCommand = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
})

const argv = mainCommand._unknown || []

const commands = {
  remote: require('./commands/remote'),
  status: require('./commands/status'),
  push: require('./commands/push')
}

if (commands[mainCommand.name]) {
  commands[mainCommand.name](argv)
}
