#!/usr/bin/env node
const colour = require('./lib/colour')
const commandLineArgs = require('command-line-args')
const mainDefinitions = [{ name: 'name', defaultOption: true }]
const mainCommand = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
})
const packageJson = require('./package.json')

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

version ${packageJson.version}
https://github.com/richorama/azsync

Add a storage account:
> azsync remote add REMOTE_NAME STORAGE_CONNECTION_STRING

To see if local files are in sync with a container:
> azsync status REMOTE_NAME CONTAINER_NAME

To push local files to a container:
> azsync push REMOTE_NAME CONTAINER_NAME

To pull remote files down to the local folder:
> azsync pull REMOTE_NAME CONTAINER_NAME
`,
    colour.blue
  )
)
