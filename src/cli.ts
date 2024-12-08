import { Builtins, Cli } from 'clipanion'
import { DownloadCommand } from './commands/DownloadCommand'
import { APP_NAME, pkg } from './pkg'

const cli = new Cli({
  binaryLabel: APP_NAME,
  binaryName: Object.keys(pkg.bin)[0],
  binaryVersion: pkg.version,
})

cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)
cli.register(DownloadCommand)

cli.runExit(process.argv.slice(2))
