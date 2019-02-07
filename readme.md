# azsync

A command line tool to efficiently synchronize files between a local directory and azure storage containers, by only uploading/downloading the files that have changed.

## Installation

```
> npm install azsync -g
```

## Usage

To add a storage account:

```
> azsync remote add REMOTE_NAME STORAGE_CONNECTION_STRING
```

To list storage accounts:

```
> azsync remote list
```

Or to see the connection info:

```
> azsync remote list --verbose
```

To see if local files are in sync with a container:

```
> azsync status REMOTE_NAME CONTAINER_NAME
```

To push local files to a container:

(this will upload the files that have changed, and overwrite the files in the container)

```
> azsync push REMOTE_NAME CONTAINER_NAME
```

To pull remote files down to the local folder:

(this will download the files that have changed, and overwrite the files in the local folder)

```
> azsync pull REMOTE_NAME CONTAINER_NAME
```

Note that in all cases where the `REMOTE_NAME` argument is used, the storage connection string can be used instead.


## TODO

* Prune remote/local files
* Wipe a remote
* Support snapshotting
* Warn on remote files with no MD5
* Pretty print total file upload size
* List remote containers
* Set a default remote/container
* read local & remote files at the same time
* Improve help system
* publish on npm
* allow remote details to be stored in a .azsync file

## License

MIT
