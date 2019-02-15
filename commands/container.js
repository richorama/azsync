const commander = require('../lib/commander')

const commands = {
  list: require('./container-list'),
  delete: require('./container-delete')
}

module.exports = argv => commander(commands, argv)
