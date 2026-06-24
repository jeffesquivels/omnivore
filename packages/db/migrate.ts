/* eslint-disable @typescript-eslint/naming-convention */
import chalk from 'chalk'
import * as dotenv from 'dotenv'
import Postgrator from 'postgrator'

dotenv.config()

const log = (text: string, style: typeof chalk.white = chalk.white): void =>
  console.log(`${chalk.cyanBright('>')} ${style(text)}`)

const postgrator = new Postgrator({
  migrationDirectory: __dirname + '/migrations',
  driver: 'pg',
  connectionString: process.env.PG_STRING,
  // Schema table name
  schemaTable: 'schemaversion',
  // Validate migration md5 checksum to ensure the contents of the script have not changed
  validateChecksums: true,
})

log('Starting migration manager')

const targetMigration = process.argv[2]

const targetMigrationLabel = targetMigration
  ? `'${chalk.blue(targetMigration)}'`
  : chalk.blue('latest')

log(`Migrating to ${targetMigrationLabel}.\n`)

const logAppliedMigrations = (
  appliedMigrations: Postgrator.Migration[]
): void => {
  if (appliedMigrations.length > 0) {
    log(
      `Applied ${chalk.green(
        appliedMigrations.length.toString()
      )} migrations successfully:`
    )
    for (const migration of appliedMigrations) {
      const actionLabel =
        migration.action === 'do' ? chalk.green('+') : chalk.red('-')
      console.log(`  ${actionLabel} ${migration.name}`)
    }
  } else {
    log(`No Postgres migrations applied.`)
  }
}

// postgres migration
const postgresMigration = postgrator
  .migrate(targetMigration)
  .then(logAppliedMigrations)
  .catch((error) => {
    log(
      `${chalk.red('Postgres migration failed: ')}${error.message}`,
      chalk.red
    )
    const { appliedMigrations } = error
    logAppliedMigrations(appliedMigrations)
    process.exit(1)
  })

postgresMigration.then(() => log('Exiting...'))
