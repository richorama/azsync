const azure = require('azure-storage')
const cookie = require('cookie')

function createClient(remote) {
  const connInfo = cookie.parse(remote.connection)
  return azure.createBlobService(connInfo.AccountName, connInfo.AccountKey)
}

function mapResults(allResults, results) {
  ;(results.entries || []).forEach(x => {
    allResults.push({
      path: x.name,
      md5: x.contentSettings.contentMD5,
      size: parseInt(x.contentLength),
      lastModified: x.lastModified
    })
  })
}

module.exports = remote => {
  const blobClient = createClient(remote)

  return {
    discoverFiles: container => {
      return new Promise((resolve, reject) => {
        const allResults = []

        function getResults(continuationToken) {
          blobClient.listBlobsSegmented(
            container,
            continuationToken,
            (err, results) => {
              if (err) return reject(err)
              mapResults(allResults, results)

              if (results.continuationToken) {
                return getResults(results.continuationToken)
              }
              return resolve(allResults)
            }
          )
        }

        getResults()
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
    },

    deleteFile: (container, file) => {
      return new Promise((resolve, reject) => {
        blobClient.deleteBlobIfExists(container, file.path, err => {
          if (err) return reject(err)
          resolve()
        })
      })
    },

    listContainers: () => {
      return new Promise((resolve, reject) => {
        blobClient.listContainersSegmented(null, (err, result) => {
          if (err) return reject(err)
          resolve(result.entries);
        })
      })

    }

  }
}
