#!/usr/bin/env node

const shell = require('shelljs')
const chalk = require('chalk')

const stdout = shell.exec('npm config get registry')
if (stdout.indexOf('registry.npmjs.org/') === -1) {
  console.log(chalk.red(
    'Failed: set npm registry to https://registry.npmjs.org/   or  http://registry.npmjs.org/ first'
  ))
  process.exit(1)
}

const { code: lintCode } = shell.exec('npm run lint')
if (lintCode === 1) {
  console.log(chalk.red('Failed: npm run lint'))
  process.exit(1)
}

const { code: buildCode } = shell.exec('npm run build')
if (buildCode === 1) {
  console.log(chalk.red('Failed: npm run build'))
  process.exit(1)
}

shell.exec('npm publish')

if (!shell.which('git')) {
  console.log(chalk.red('Sorry,this script requires git'))
  process.exit(1)
}

shell.exec('git add .')

const { code: gitCommitCode } = shell.exec('git commit -am "auto-commit by npm publish"')
if (gitCommitCode === 1) {
  console.log(chalk.red('Error: git commit failed'))
  process.exit(1)
}

const { code: gitPushCode } = shell.exec('git push')
if (gitPushCode === 1) {
  console.log(chalk.red('Error: git push failed'))
  process.exit(1)
}
