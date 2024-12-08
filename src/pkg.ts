import { createRequire } from 'module'
import packageJSON from '../package.json'

export const APP_NAME = 'bilibili-dynamic-saver'
export const APP_SHORT_NAME = 'bili-dyn'

export type CurrentPackageJson = typeof packageJSON
const _require = createRequire(import.meta.url)
export const pkg = _require('../package.json') as CurrentPackageJson
