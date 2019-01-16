const fs = require('fs')
const path = require('path')

module.exports = walkSync

function walkSync(dir, fileList) {
  fileList = fileList || []
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      return walkSync(filePath, fileList)
    }
    fileList.push(filePath)
  })
  return fileList
}
