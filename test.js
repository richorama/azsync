const files = require('./lib/files')
const md5 = require('./lib/md5')
const discoverLocalFiles = require('./lib/discoverLocalFiles')
const storage = require('./lib/storage')

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

    if (
      hash.toLowerCase() !== '96C0D686B60669D9EB74FD9C68123E02'.toLowerCase()
    ) {
      return done(`unexpected hash value (${hash})`)
    }

    done()
  })
})

describe('lib/discoverLocalFiles', () => {
  it('return the path and hash of all files in a directory', done => {
    const fileList = discoverLocalFiles('./lib')
    if (fileList.length === 0) return done('no files returned')
    if (!fileList[0].path) return done('no path')
    if (!fileList[0].md5) return done('no md5')
    return done()
  })
})

describe('lib/storage', () => {
  it('saves and retrieves values', async () => {
    await storage.put('test', { foo: 'bar' })
    const val = await storage.get('test')
    if (!val) throw new Error('no value')

    if (val.foo !== 'bar')
      throw new Error(`unexepected value in the baggage area (${val})`)
  })
})

describe('lib/storage', () => {
  it('getting a null', async () => {
    const val = await storage.get('XXX')
    if (val) throw new Error('no value')

  })
})