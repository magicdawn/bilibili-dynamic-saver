import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
export { dayjs }

export { default as fse } from 'fs-extra'
export { default as logSymbols } from 'log-symbols'
