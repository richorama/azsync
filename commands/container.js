const commander = require('../lib/commander')

const commands = {
  list: require('./container-list')
}

module.exports = argv => commander(commands, argv)
