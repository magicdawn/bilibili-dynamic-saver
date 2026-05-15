import 'dayjs/locale/zh-cn.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
export { dayjs }

export { default as fse } from 'fs-extra'
export { default as logSymbols } from 'log-symbols'
