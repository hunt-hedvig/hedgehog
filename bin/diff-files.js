#!/usr/bin/env node

const childProcess = require('child_process')
const filesToIgnore = require('../.typecheck-ignore.json')

const getDiffFiles = (callback) => {
  childProcess.exec(
    'git diff master --name-only *.{ts,tsx}',
    (err, diffFilesString, stderr) => {
      if (err) {
        console.error(stderr)
        console.error(err)
        process.exit(1)
      }

      childProcess.exec(
        'git ls-files . --exclude-standard --others',
        (err, untrackedFilesString, stderr) => {
          if (err) {
            console.error(stderr)
            console.error(err)
            process.exit(1)
          }

          const diffFiles = diffFilesString
            .split('\n')
            .filter((file) => !filesToIgnore.includes(file))
            .filter(Boolean)
          const untrackedFiles = untrackedFilesString
            .split('\n')
            .filter((file) => /.tsx?$/.test(file))
            .filter((file) => !filesToIgnore.includes(file))
          const files = diffFiles.concat(untrackedFiles)

          callback(files)
        },
      )
    },
  )
}

if (require.main === module) {
  getDiffFiles((files) => {
    console.log(files.join('\n'))
  })
}

module.exports = { getDiffFiles }
