import esmUtils from 'esm-utils'
import path from 'path'
import { beforeAll, chai, describe, expect, it } from 'vitest'
import { getUpName, useCookieFile } from '../src'

chai.should()
const { __dirname } = esmUtils(import.meta)

beforeAll(() => {
  useCookieFile(path.join(__dirname, './fixtures/bilibili.cookie.txt'))
})

describe('Simple Test', () => {
  it('getUpName works', async () => {
    const name = await getUpName('21837784')
    expect(name).toEqual('阿斗归来了')
  })
})
