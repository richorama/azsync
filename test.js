const files = require('./lib/files')
const md5 = require('./lib/md5')
const discoverLocalFiles = require('./lib/discoverLocalFiles')

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
    const hash = md5('./lib/md5.js')

    if (hash.toLowerCase() !== '96C0D686B60669D9EB74FD9C68123E02'.toLowerCase()) {
      return done(`unexpected hash value (${hash})`)
    }

    done()
  })
})

describe('lib/discoverLocalFiles', () => {
  it ('return the path and hash of all files in a directory', done => {
    const fileList = discoverLocalFiles('./lib')
    if (fileList.length === 0) return done('no files returned')
    if (!fileList[0].path) return done('no path')
    if (!fileList[0].md5) return done('no md5')
    return done()
  })
})