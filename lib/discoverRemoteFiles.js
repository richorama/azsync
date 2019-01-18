var azure = require('azure-storage')

// https://www.npmjs.com/package/node-persist
module.exports = (remote, container, cb) => {
  var blobClient = azure.createBlobService(remote.account, remote.accessKey)

  blobClient.listBlobsSegmented(container, (err, results) => {
    console.log(err, results)
    cb(results)
  })
}
