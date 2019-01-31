const fs = require('fs')
const path = require('path')
const Ignore = require('ignore')

module.exports = walkSync

function walkSync(dir, fileList, ignore) {

  const azIgnorePath = path.join(dir, '.azignore')
  if (fs.existsSync(azIgnorePath)){
    ignore = Ignore()
    ignore.add(fs.readFileSync(azIgnorePath).toString())
  }

  fileList = fileList || []
  let files = fs.readdirSync(dir)

  // filter out ignored files
  if (ignore){
    files = ignore.filter(files)
  }

  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      return walkSync(filePath, fileList, ignore)
    }
    fileList.push(filePath)
  })
  return fileList
}
