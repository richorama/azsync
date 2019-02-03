const crypto = require('crypto')
const fs = require('fs')

module.exports = filename => {
  const data = fs.readFileSync(filename)
  return {
    md5: crypto
      .createHash('md5')
      .update(data)
      .digest('base64'),
    size: data.length
  }
}
