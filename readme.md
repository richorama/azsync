![](https://travis-ci.org/richorama/azsync.svg?branch=master)

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

To list the containers for a remote:

```
> azsync container list REMOTE_NAME
```

To delete a container on a remote:

```
> azsync container delete REMOTE_NAME CONTAINER_NAME
```

Note that in all cases where the `REMOTE_NAME` argument is used, the storage connection string can be used instead.

## How it Works

Azsync calculates the MD5 hash for each file it finds in the current working directory,
working recursively through all folders.

It then queries the given Azure Blob Storage Container
to retrieve the names of all blobs, and their MD5 hashes.

It then compares hashes, to determine which files have changed, so it can upload/download only
the difference.

## TODO

* Add flag to make a container public/private
* Add a command to get the url for a container
* Support snapshotting
* Warn on remote files with no MD5
* Set a default remote/container
* read local & remote files at the same time
* Improve help system
* allow remote details to be stored in a .azsync file

## License

MIT
