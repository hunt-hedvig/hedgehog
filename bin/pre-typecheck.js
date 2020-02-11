#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { getDiffFiles } = require('./diff-files')

const TSCONFIG_FILE = path.resolve(__dirname, '../tsconfig-diff-master.json')

getDiffFiles((files) => {
  console.log('Preparing typecheck of files:\n' + files.join('\n'))

  const tsconfig = {
    extends: './tsconfig.json',
    files,
  }
  fs.writeFileSync(TSCONFIG_FILE, JSON.stringify(tsconfig, null, 2) + '\n')
})
