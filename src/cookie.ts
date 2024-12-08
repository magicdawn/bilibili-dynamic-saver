import path from 'path'
import { xdgConfig } from 'xdg-basedir'
import { request } from '.'
import { fse } from './libs'
import { APP_NAME } from './pkg'

export const DEFAULT_COOKIE_FILE = 'bilibili.cookie.txt'

export function useCookieFile(cookieFile: string) {
  const cookie = fse
    .readFileSync(cookieFile, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => Boolean(l))
    .filter((l) => !(l.startsWith('//') || l.startsWith('#')))
    .join('')
  request.defaults.headers['cookie'] = cookie
}

export function getUsingCookieFile(file?: string) {
  if (file) return file

  {
    const file = path.resolve(DEFAULT_COOKIE_FILE)
    if (fse.existsSync(file)) return file
  }

  {
    const file = path.join(xdgConfig!, APP_NAME, DEFAULT_COOKIE_FILE)
    if (fse.existsSync(file)) return file
  }

  {
    const file = path.join(xdgConfig!, APP_NAME, 'cookie.txt')
    if (fse.existsSync(file)) return file
  }
}
