module.exports = (text, colour) => `\x1b[${colour}m${text}\x1b[0m`

module.exports.red = 31
module.exports.green = 32
module.exports.yellow = 33
