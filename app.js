const commandLineArgs = require('command-line-args')

const mainDefinitions = [
  { name: 'name', defaultOption: true }
]

const mainCommand = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
let argv = mainCommand._unknown || []

const commands = {
  remote : require('./commands/remote')
}

if (commands[mainCommand.name]){
  commands[mainCommand.name](argv)
}

/* second - parse the main command options */
  
if (mainCommand.name === 'run') {
  const runDefinitions = [
    { name: 'detached', alias: 'd', type: Boolean },
    { name: 'target', defaultOption: true }
  ]
  const runOptions = commandLineArgs(runDefinitions, { argv, stopAtFirstUnknown: true })
  argv = runOptions._unknown || []

  console.log('\nrunOptions\n==========')
  console.log(runOptions)

  /* third - parse the sub-command  */
  const subCommandDefinitions = [
    { name: 'name', defaultOption: true }
  ]
  const subCommand = commandLineArgs(subCommandDefinitions, { argv, stopAtFirstUnknown: true })

  console.log('\nsubCommand\n==========')
  console.log(subCommand)
}