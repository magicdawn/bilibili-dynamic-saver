import { createRequire } from 'module'

import packageJSON from '../package.json'
export type CurrentPackageJson = typeof packageJSON

const _require = createRequire(import.meta.url)
export const pkg = _require('../package.json') as CurrentPackageJson
