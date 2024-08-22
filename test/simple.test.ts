import path from 'path'
import { beforeAll, chai, describe, expect, it } from 'vitest'
import { getUpName } from '../src'
import { useCookieFile } from '../src/cookie'

chai.should()

beforeAll(() => {
  useCookieFile(path.join(import.meta.dirname, './fixtures/bilibili.cookie.txt'))
})

describe('Simple Test', () => {
  it('getUpName works', async () => {
    const name = await getUpName('21837784')
    expect(name).toEqual('阿斗归来了')
  })
})
