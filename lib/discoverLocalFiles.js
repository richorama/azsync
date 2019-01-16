const files = require('./files')
const md5 = require('./md5')

module.exports = dir => {
  return files(dir).map(path => ({
    path,
    md5: md5(path)
  }))
}
