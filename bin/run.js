'use strict'
const sspk = require('../lib/sspk')
const edlfiles = require('../lib/edlfiles')
const chalk = require('chalk')
const cli = require('commander')
const pkg = require('../package.json')

// We want to have console output in the CLI app
/* eslint-disable no-console */

let validate = (filepath) => {
  try {
    let students = sspk.verify(filepath)
    console.log(chalk.green('File is OK'))
    return students
  } catch (err) {
    console.log(chalk.red('Error: ') + err)
    if (err.isJoi) {
      console.log(chalk.yellow('Details: ') + err.annotate())
    }
  }
}

let gen = (filepath, destination_directory) => {
  const students = validate(filepath)

  if (!destination_directory) {
    destination_directory = './'
  }

  if (students) {
    edlfiles.genServerNames(students, destination_directory + '/servernames')
    edlfiles.genUsersKeys(students, destination_directory + '/keys/')
  }
}


cli
  .version(pkg.version)
  .command('validate <filepath>')
  .description('Validate an sspk yaml file')
  .action(validate)

cli
  .command('gen <filepath> [destination_directory]')
  .description('Generate the needed files')
  .action(gen)

cli.parse(process.argv)

// if program was called with no arguments, show help.
if (cli.args.length === 0) {
  cli.help()
}
