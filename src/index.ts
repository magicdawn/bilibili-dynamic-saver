import axios from 'axios'
import { dl } from 'dl-vampire'
import filenamify from 'filenamify'
import path from 'path'
import pmap from 'promise.map'
import { DynamicFeedItem, DynamicFeedJson, DynamicType } from './define/dynamic-feed-json'
import { dayjs, fse, logSymbols } from './libs'

export function getRecordFile(downloadDir: string) {
  return path.join(downloadDir, '.last-downloaded-record.txt')
}

function readRecord(downloadDir: string): number | undefined {
  const recordFile = getRecordFile(downloadDir)
  if (!fse.existsSync(recordFile)) return
  const content = fse.readFileSync(recordFile, 'utf8')
  if (!/^\d+$/.test(content)) return
  return Number(content)
}

function saveRecord(downloadDir: string, ts: number) {
  const recordFile = getRecordFile(downloadDir)
  fse.outputFileSync(recordFile, ts.toString())
}

export const request = axios.create({
  headers: {
    Referer: 'https://t.bilibili.com/',
    // cookie: cookie,
  },
})

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

export async function getUpName(mid: string) {
  const res = await request.get('https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all', {
    params: {
      host_mid: mid,
      offset: '',
      page: 1,
      features: 'itemOpusStyle,listOnlyfans',
    },
  })
  const json = res.data as DynamicFeedJson
  const upName = json.data?.items[0].modules.module_author.name
  if (!upName) {
    console.warn('[getUpName]: %j', json)
  }
  return upName
}

export async function getDynamicOf(mid: string, lastDownloadItemPubTs: number | undefined) {
  let page = 1
  const singleRequest = async (paramOffset = '') => {
    console.log('singleRequest: page = %s, offset = %s', page, paramOffset)
    const res = await request.get('https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all', {
      params: {
        host_mid: mid,
        offset: paramOffset,
        page: page++,
        features: 'itemOpusStyle,listOnlyfans',
      },
    })

    const json = res.data as DynamicFeedJson
    let has_more = json.data.has_more
    const offset = json.data.offset

    // do not call api for old info
    if (has_more && lastDownloadItemPubTs) {
      const pub_ts = json.data.items.at(-1)!.modules.module_author.pub_ts
      if (pub_ts <= lastDownloadItemPubTs) {
        has_more = false
      }
    }

    return { json, has_more, offset }
  }

  let has_more = true
  let offset = ''
  let items: DynamicFeedItem[] = []
  do {
    const result = await singleRequest(offset)
    has_more = result.has_more
    offset = result.offset
    items = [...items, ...result.json.data.items]
  } while (has_more)

  return items
}

export async function downloadDynamicOf(mid: string) {
  const upName = await getUpName(mid)
  if (!upName) {
    console.error('can not get up name, please set cookie manually')
    return
  }

  const downloadDir = `[${upName}]`

  const lastDownloadItemPubTs = readRecord(downloadDir)
  let items = await getDynamicOf(mid, lastDownloadItemPubTs)
  if (lastDownloadItemPubTs) {
    items = items.filter((x) => {
      const pub_ts = x.modules.module_author.pub_ts
      return pub_ts > lastDownloadItemPubTs
    })
  }
  const drawItems = items.filter((x) => x.type === DynamicType.DynamicTypeDraw)

  let maxPubTs = 0
  const tasks: Array<{ url: string; file: string }> = []
  for (const item of drawItems) {
    const opus = item.modules.module_dynamic.major?.opus
    if (!opus) continue

    let text = opus.summary.text
    if (text.length > 200) {
      text = text.slice(0, 200) + '...'
    }

    const pics = opus.pics.map((x) => x.url)

    const pub_ts = item.modules.module_author.pub_ts
    maxPubTs = Math.max(pub_ts, maxPubTs)
    const date = dayjs.unix(pub_ts).format('YYYY-MM-DD')

    pics.forEach((url, index) => {
      const ext = path.extname(url)
      tasks.push({
        url,
        file: path.join(downloadDir, `${date} ${filenamify(text)} ${index + 1}${ext}`),
      })
    })
  }

  await pmap(
    tasks,
    async ({ url, file }) => {
      await dl({ url, file })
      console.log(`${logSymbols.success} %s`, file)
    },
    6
  )

  // do not save 0
  if (maxPubTs) {
    saveRecord(downloadDir, maxPubTs)
  }
}
