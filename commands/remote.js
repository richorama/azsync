const commander = require('../lib/commander')

const commands = {
  add: require('./remote-add'),
  list: require('./remote-list')
}

module.exports = argv => commander(commands, argv)
