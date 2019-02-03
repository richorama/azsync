module.exports = (localFiles, remoteFiles) => {
  const localDictionary = toObject(localFiles)
  const remoteDictionary = toObject(remoteFiles)

  const result = {
    localOnly: [],
    remoteOnly: [],
    unmodified: [],
    modified: [],
    toUpload: [],
    toDownload: []
  }

  localFiles.forEach(localVersion => {
    const remoteVersion = remoteDictionary[localVersion.path]
    if (!remoteVersion) {
      // local only
      result.toUpload.push(localVersion)
      result.localOnly.push(localVersion)
      return
    }
    if (remoteVersion.md5 === localVersion.md5) {
      // unmodified
      return result.unmodified.push(localVersion)
    }

    // modified
    result.toUpload.push(localVersion)
    result.modified.push(localVersion)
    result.upDownload.push(remoteVersion)
  })

  remoteFiles.forEach(remoteVersion => {
    if (!localDictionary[remoteVersion.path]) {
      result.remoteOnly.push(remoteVersion)
      result.toDownload.push(remoteVersion)
    }
  })

  return result
}

function toObject(files) {
  const value = {}
  files.forEach(x => (value[x.path] = x))
  return value
}
