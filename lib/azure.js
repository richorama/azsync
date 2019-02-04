const azure = require('azure-storage')
const cookie = require('cookie')

function createClient(remote) {
  const connInfo = cookie.parse(remote.connection)
  return azure.createBlobService(connInfo.AccountName, connInfo.AccountKey)
}

function mapResults(results) {
  return (results.entries || []).map(x => ({
    path: x.name,
    md5: x.contentSettings.contentMD5,
    size: parseInt(x.contentLength),
    lastModified: x.lastModified
  }))
}

module.exports = remote => {
  const blobClient = createClient(remote)

  return {
    discoverFiles: container => {
      return new Promise((resolve, reject) => {
        blobClient.listBlobsSegmented(container, null, (err, results) => {
          if (err) return reject(err)
          resolve(mapResults(results))
        })
      })
    },

    createContainer: container => {
      return new Promise((resolve, reject) => {
        var blobClient = createClient(remote)

        blobClient.createContainerIfNotExists(container, err => {
          if (err) return reject(err)
          resolve()
        })
      })
    },

    uploadFile: (container, file) => {
      return new Promise((resolve, reject) => {
        blobClient.createBlockBlobFromLocalFile(
          container,
          file.path,
          file.path,
          { contentMD5: file.md5 },
          err => {
            if (err) return reject(err)
            resolve()
          }
        )
      })
    },

    downloadFile: (container, file) => {
      return new Promise((resolve, reject) => {
        blobClient.getBlobToLocalFile(container, file.path, file.path, err => {
          if (err) return reject(err)
          resolve()
        })
      })
    }
  }
}
