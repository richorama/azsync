#!/usr/bin/env node
const colour = require('./lib/colour')
const commandLineArgs = require('command-line-args')
const mainDefinitions = [{ name: 'name', defaultOption: true }]
const mainCommand = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
})

const argv = mainCommand._unknown || []

const commands = {
  remote: require('./commands/remote'),
  status: require('./commands/status'),
  push: require('./commands/push'),
  pull: require('./commands/pull'),
  container: require('./commands/container')
}

if (commands[mainCommand.name]) {
  return commands[mainCommand.name](argv)
}

console.log(
  colour(
    `
  __   ____  ____  _  _  __ _   ___
 / _\\ (__  )/ ___)( \\/ )(  ( \\ / __)
/    \\ / _/ \\___ \\ )  / /    /( (__
\\_/\\_/(____)(____/(__/  \\_)__) \\___)
`,
    colour.blue
  )
)
