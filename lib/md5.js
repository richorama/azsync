const crypto = require('crypto');
const fs = require('fs')

module.exports = filename => {
  const data = fs.readFileSync(filename)
  return crypto.createHash('md5').update(data).digest("base64");
}