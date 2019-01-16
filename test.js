const files = require('./lib/files')
const md5 = require('./lib/md5')

describe('lib/files', () => {
  it('lists all files recursively', done => {
    const fileList = files('./lib/')

    if (fileList.indexOf('lib/files.js') === -1)
      return done(`filed to find expected file [${fileList.join()}]`)

    done()
  })
})

describe('lib/md5', () => {
  it('calculates the md5 hash of a file', done => {
    var hash = md5('./lib/md5.js')

    if (hash.toLowerCase() !== '96C0D686B60669D9EB74FD9C68123E02'.toLowerCase()) {
      return done(`unexpected hash value (${hash})`)
    }

    done()
  })
})
