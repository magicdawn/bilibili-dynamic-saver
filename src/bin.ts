import { cli } from 'cleye'
import { createRequire } from 'module'
import path from 'path'
import type { PackageJson } from 'type-fest'
import { downloadDynamicOf, useCookieFile } from './index'
import { fse, logSymbols } from './libs'

const _require = createRequire(import.meta.url)
const { name, version } = _require('../package.json') as PackageJson

const argv = cli(
  {
    name,
    version,
    parameters: ['<mid>'],
    flags: {
      cookie: {
        type: String,
        alias: 'c',
        description: 'txt file of exported cookie',
        default: 'bilibili.cookie.txt',
      },
    },
  },
  async (parsed) => {
    const { mid } = parsed._
    let { cookie } = parsed.flags

    if (!mid) throw new Error('mid is required')
    if (!/^\d+$/.test(mid)) throw new Error('invalid mid format')

    if (cookie) {
      cookie = path.resolve(cookie)
      if (fse.existsSync(cookie)) {
        console.log(`${logSymbols.info} using cookie file %s`, cookie)
        useCookieFile(cookie)
      }
    }

    await downloadDynamicOf(mid)
  },
)
