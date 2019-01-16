const files = require('./lib/files')

describe('lib/files', () => {
  it('lists all files recursively', done => {
    const fileList = files('./lib/')

    if (fileList.indexOf('lib/files.js') === -1)
      return done(`filed to find expected file [${fileList.join()}]`)

    done()
  })
})
