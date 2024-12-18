import { Command, Option, type Usage } from 'clipanion'
import path from 'path'
import { z } from 'zod'
import { downloadDynamicOf } from '..'
import { DEFAULT_COOKIE_FILE, getUsingCookieFile, useCookieFile } from '../cookie'
import { fse, logSymbols } from '../libs'
import { APP_NAME } from '../pkg'

export class DownloadCommand extends Command {
  static paths?: string[][] | undefined = [Command.Default]

  static usage?: Usage | undefined = {
    description: 'Bilibili dynamic saver',
    details: `
    ## cookie \n
    default search paths: \n
      - \`./${DEFAULT_COOKIE_FILE}\`
      - \`~/.config/${APP_NAME}/${DEFAULT_COOKIE_FILE}\`
      - \`~/.config/${APP_NAME}/cookie.txt\`

    ## dir \n
    default \`./[\${up-name}]\`
    `,
  }

  mid = Option.String({
    required: false,
    name: 'mid',
  })

  cookie = Option.String('-c,--cookie', {
    description: 'cookie file path',
  })

  dir = Option.String('-d,--dir', {
    description: 'directory to store downloaded files',
  })

  async execute(): Promise<number | void> {
    const mid = this.mid
      ? z.string().regex(/^\d+$/, { message: 'invalid mid' }).parse(this.mid)
      : undefined

    let cookie = getUsingCookieFile(this.cookie)
    if (cookie) {
      cookie = path.resolve(cookie)
      if (fse.existsSync(cookie)) {
        console.log(`${logSymbols.info} using cookie file %s`, cookie)
        useCookieFile(cookie)
      }
    }

    await downloadDynamicOf(mid, this.dir)
  }
}
