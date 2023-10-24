#!/usr/bin/env node

import { cac } from 'cac'
import esmUtils from 'esm-utils'
import path from 'path'
import { downloadDynamicOf, useCookieFile } from './index'
import { fse, logSymbols } from './libs'

const { require } = esmUtils(import.meta)

const cli = cac()

cli
  .command('[mid]', `UP's mid`)
  .option('--cookie', 'txt file of exported cookie', { default: 'bilibili.cookie.txt' })
  .action(async (mid: string, options) => {
    if (!mid) {
      cli.outputHelp()
      return
    }

    let cookie = options.cookie
    if (cookie) {
      cookie = path.resolve(cookie)
      if (fse.existsSync(cookie)) {
        console.log(`${logSymbols.info} using cookie file %s`, cookie)
        useCookieFile(cookie)
      }
    }

    await downloadDynamicOf(mid)
  })

// Display help message when `-h` or `--help` appears
cli.help()

// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version(require('../package.json').version)

cli.parse()
